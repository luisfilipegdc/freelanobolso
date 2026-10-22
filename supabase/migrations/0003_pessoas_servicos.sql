-- Freela no Bolso — Fase 2: pontos de Pessoas/Serviços e fotos das pessoas

-- PONTOS (docs/06-gamificacao.md)
-- Criar o item registra o ponto em point_events; excluir o item apaga o ponto.
-- O trigger trg_points (0001) mantém profiles.points em dia.
create or replace function award_points() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  qtd int := tg_argv[1]::int;
begin
  if tg_op = 'INSERT' then
    insert into point_events (owner_id, action, points, ref_id)
    values (new.owner_id, tg_argv[0], qtd, new.id);
    return new;
  end if;
  delete from point_events where owner_id = old.owner_id and action = tg_argv[0] and ref_id = old.id;
  return old;
end $$;

create trigger trg_people_points after insert or delete on people
  for each row execute function award_points('person_created', '2');
create trigger trg_services_points after insert or delete on services
  for each row execute function award_points('service_created', '5');

-- Pontos são concedidos só pelos triggers: o usuário pode ler o próprio extrato, mas não escrever.
drop policy if exists own_rows on point_events;
create policy own_points_read on point_events for select using (owner_id = auth.uid());

create index if not exists people_owner_idx on people (owner_id, created_at desc);
create index if not exists services_owner_idx on services (owner_id, created_at desc);
create index if not exists point_events_ref_idx on point_events (ref_id);

-- FOTOS (Storage). Caminho: <owner_id>/<arquivo>. Leitura pública porque a foto aparece na Área do Cliente.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('fotos', 'fotos', true, 2097152, array['image/svg+xml', 'image/png', 'image/jpeg', 'image/gif'])
on conflict (id) do nothing;

create policy fotos_insert on storage.objects for insert to authenticated
  with check (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy fotos_update on storage.objects for update to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy fotos_delete on storage.objects for delete to authenticated
  using (bucket_id = 'fotos' and (storage.foldername(name))[1] = auth.uid()::text);

-- PERFIL: o usuário edita os próprios dados, mas não pontos, plano nem fim do trial
-- (esses só mudam por triggers e pelo checkout, com service role).
revoke insert, update on profiles from anon, authenticated;
grant update (
  name, company_name, phone, birth_date, cpf, avatar_url, presentation, areas, team_size,
  monthly_revenue_range, doc_type, legal_name, cnpj, cep, address, address_number, complement,
  city, state, pix_key
) on profiles to authenticated;
