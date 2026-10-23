-- Freela no Bolso — Fase 3: propostas

-- +5 pontos ao criar uma proposta (excluir remove).
create trigger trg_proposals_points after insert or delete on proposals
  for each row execute function award_points('proposal_created', '5');

create index if not exists proposals_owner_idx on proposals (owner_id, created_at desc);
create index if not exists proposal_items_proposal_idx on proposal_items (proposal_id, position);

-- LINK PÚBLICO /proposta/[slug]
-- O cliente não tem login. Em vez de abrir a tabela para anon, expomos só estas
-- funções, que devolvem/alteram exatamente uma proposta pelo slug (aleatório).

create or replace function proposta_publica(p_slug text) returns jsonb
language sql stable security definer set search_path = public as $$
  select jsonb_build_object(
    'title', p.title,
    'cover_url', p.cover_url,
    'objective', p.objective,
    'presentation', p.presentation,
    'expires_at', p.expires_at,
    'discount_pct', p.discount_pct,
    'deadline_days', p.deadline_days,
    'deadline_business_days', p.deadline_business_days,
    'payment_structure', p.payment_structure,
    'installments_description', p.installments_description,
    'payment_methods', p.payment_methods,
    'notes', p.notes,
    'status', p.status,
    'sent_at', p.sent_at,
    'answered_at', p.answered_at,
    'created_at', p.created_at,
    'is_owner', coalesce(p.owner_id = auth.uid(), false),
    'cliente', (select jsonb_build_object('name', pe.name) from people pe where pe.id = p.person_id),
    'freelancer', (
      select jsonb_build_object(
        'name', pr.name, 'company_name', pr.company_name, 'avatar_url', pr.avatar_url,
        'phone', pr.phone, 'email', u.email
      )
      from profiles pr join auth.users u on u.id = pr.id
      where pr.id = p.owner_id
    ),
    'items', coalesce((
      select jsonb_agg(jsonb_build_object(
        'name', i.name, 'description', i.description, 'quantity', i.quantity, 'unit_price', i.unit_price
      ) order by i.position)
      from proposal_items i where i.proposal_id = p.id
    ), '[]'::jsonb)
  )
  from proposals p
  where p.public_slug = p_slug and p.status <> 'rascunho';
$$;

-- "Saber quando o cliente visualizou": a primeira abertura por alguém que não é o dono.
create or replace function registrar_visualizacao_proposta(p_slug text) returns void
language sql volatile security definer set search_path = public as $$
  update proposals
     set status = 'visualizada', viewed_at = now()
   where public_slug = p_slug
     and status = 'enviada'
     and owner_id is distinct from auth.uid();
$$;

-- Aceitar ou recusar. Só vale para proposta enviada/visualizada e dentro da validade.
create or replace function responder_proposta(p_slug text, p_aceitar boolean) returns proposal_status
language sql volatile security definer set search_path = public as $$
  update proposals
     set status = case when p_aceitar then 'aceita'::proposal_status else 'rejeitada'::proposal_status end,
         answered_at = now(),
         viewed_at = coalesce(viewed_at, now())
   where public_slug = p_slug
     and status in ('enviada', 'visualizada')
     and (expires_at is null or expires_at >= (now() at time zone 'America/Sao_Paulo')::date)
     and owner_id is distinct from auth.uid()
  returning status;
$$;

revoke execute on function proposta_publica(text) from public;
revoke execute on function registrar_visualizacao_proposta(text) from public;
revoke execute on function responder_proposta(text, boolean) from public;
grant execute on function proposta_publica(text) to anon, authenticated;
grant execute on function registrar_visualizacao_proposta(text) to anon, authenticated;
grant execute on function responder_proposta(text, boolean) to anon, authenticated;
