-- Freela no Bolso — schema inicial (Supabase / Postgres)
create extension if not exists "pgcrypto";

-- ENUMS
create type person_type      as enum ('pf','pj');
create type proposal_status  as enum ('rascunho','enviada','visualizada','aceita','rejeitada','expirada');
create type contract_status  as enum ('rascunho','aguardando_assinatura','assinado','terminado','cancelado');
create type project_status   as enum ('aguardando_inicio','em_andamento','concluido','cancelado');
create type project_kind     as enum ('unico','recorrente_mensal');
create type payment_structure as enum ('a_vista','parcelado');
create type tx_type          as enum ('receita','gasto');
create type plan_kind        as enum ('trial','mensal','anual');

-- PERFIL DO FREELANCER
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  name text not null,
  company_name text,
  phone text,
  birth_date date,
  cpf text,
  avatar_url text,
  presentation text,               -- usado nas propostas
  areas text[] default '{}',       -- áreas de atuação
  team_size text,
  monthly_revenue_range text,
  doc_type person_type default 'pf',
  legal_name text, cnpj text,
  cep text, address text, address_number text, complement text, city text, state text,
  pix_key text,
  plan plan_kind default 'trial',
  trial_ends_at timestamptz default (now() + interval '14 days'),
  points int not null default 0,
  created_at timestamptz default now()
);

-- PESSOAS (clientes e leads)
create table people (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  type person_type not null default 'pf',
  name text not null,              -- PF: nome | PJ: nome da empresa
  email text, phone text, photo_url text,
  rep_name text, rep_email text, rep_phone text, rep_cpf text,   -- PJ
  cpf text, legal_name text, cnpj text,
  cep text, address text, address_number text, complement text, city text, state text,
  is_client boolean not null default false,   -- vira true ao receber projeto
  created_at timestamptz default now()
);

-- SERVIÇOS
create table services (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  name text not null,
  description text,
  price numeric(12,2),
  archived boolean default false,
  created_at timestamptz default now()
);

-- PROPOSTAS
create table proposals (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  person_id uuid references people on delete cascade,
  title text not null,
  cover_url text,
  objective text,
  presentation text,
  expires_at date,
  discount_pct numeric(5,2) default 0,
  deadline_days int,
  deadline_business_days boolean default false,
  payment_structure payment_structure default 'a_vista',
  installments_description text,
  payment_methods text[] default '{pix}',
  notes text,
  status proposal_status not null default 'rascunho',
  public_slug text unique,
  sent_at timestamptz, viewed_at timestamptz, answered_at timestamptz,
  created_at timestamptz default now()
);
create table proposal_items (
  id uuid primary key default gen_random_uuid(),
  proposal_id uuid not null references proposals on delete cascade,
  service_id uuid references services on delete set null,
  name text not null, description text,
  quantity int not null default 1,
  unit_price numeric(12,2) not null default 0,
  position int default 0
);

-- CONTRATOS
create table contracts (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  person_id uuid references people on delete cascade,
  proposal_id uuid references proposals on delete set null,
  title text not null,
  discount_pct numeric(5,2) default 0,
  deadline_days int,
  payment_structure payment_structure default 'a_vista',
  installments_description text,
  pix_key text,
  forum_city text,
  body_snapshot text,               -- texto final congelado no envio
  status contract_status not null default 'rascunho',
  public_slug text unique,
  sent_at timestamptz, viewed_at timestamptz,
  created_at timestamptz default now()
);
create table contract_items (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts on delete cascade,
  service_id uuid references services on delete set null,
  name text not null, description text,
  quantity int not null default 1,
  unit_price numeric(12,2) not null default 0,
  position int default 0
);

create table contract_signatures (
  id uuid primary key default gen_random_uuid(),
  contract_id uuid not null references contracts on delete cascade,
  party text not null check (party in ('contratado','contratante')),
  name text not null, document text,
  ip inet, user_agent text, doc_hash text,
  signed_at timestamptz default now()
);

-- PROJETOS
create table projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  person_id uuid references people on delete cascade,
  proposal_id uuid references proposals on delete set null,
  contract_id uuid references contracts on delete set null,
  title text not null,
  kind project_kind not null default 'unico',
  total_value numeric(12,2) default 0,
  start_date date, due_date date, finished_at date,
  status project_status not null default 'aguardando_inicio',
  cover_url text,
  client_area_slug text unique,
  created_at timestamptz default now()
);
create table project_tasks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  service_name text,
  title text not null,
  done boolean default false, done_at timestamptz,
  position int default 0
);
create table project_updates (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references projects on delete cascade,
  actor text not null default 'freelancer',  -- freelancer | cliente | sistema
  message text not null,
  read_by_client boolean default false,
  created_at timestamptz default now()
);

-- FINANÇAS
create table transactions (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  type tx_type not null,
  description text not null,
  amount numeric(12,2) not null,
  date date not null default current_date,
  category text,
  project_id uuid references projects on delete set null,
  person_id uuid references people on delete set null,
  invoice_url text,
  created_at timestamptz default now()
);

-- GAMIFICAÇÃO
create table point_events (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  action text not null,           -- ex.: person_created, service_created
  points int not null,
  ref_id uuid,
  created_at timestamptz default now()
);
create table achievements (
  code text primary key, title text not null, description text not null, rule text not null
);
create table user_achievements (
  owner_id uuid references auth.users on delete cascade,
  code text references achievements,
  unlocked_at timestamptz default now(),
  primary key (owner_id, code)
);

-- SUPORTE / FEEDBACK
create table support_tickets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  subject text not null, body text not null, created_at timestamptz default now()
);
create table trial_feedback (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users on delete cascade,
  reason text not null, details text, created_at timestamptz default now()
);

-- RLS
alter table profiles enable row level security;
create policy own_profile on profiles for all using (id = auth.uid()) with check (id = auth.uid());

do $$
declare t text;
begin
  foreach t in array array['people','services','proposals','contracts','projects','transactions','point_events','support_tickets','trial_feedback','user_achievements']
  loop
    execute format('alter table %I enable row level security', t);
    execute format('create policy own_rows on %I for all using (owner_id = auth.uid()) with check (owner_id = auth.uid())', t);
  end loop;
end $$;

-- tabelas-filhas: acesso via dono do pai
alter table proposal_items enable row level security;
create policy own_items on proposal_items for all using (exists (select 1 from proposals p where p.id = proposal_id and p.owner_id = auth.uid()));
alter table contract_items enable row level security;
create policy own_items on contract_items for all using (exists (select 1 from contracts c where c.id = contract_id and c.owner_id = auth.uid()));
alter table contract_signatures enable row level security;
create policy own_sigs on contract_signatures for select using (exists (select 1 from contracts c where c.id = contract_id and c.owner_id = auth.uid()));
alter table project_tasks enable row level security;
create policy own_tasks on project_tasks for all using (exists (select 1 from projects p where p.id = project_id and p.owner_id = auth.uid()));
alter table project_updates enable row level security;
create policy own_updates on project_updates for all using (exists (select 1 from projects p where p.id = project_id and p.owner_id = auth.uid()));
alter table achievements enable row level security;
create policy read_all on achievements for select using (true);

-- Lead -> Cliente ao criar projeto
create or replace function mark_person_as_client() returns trigger language plpgsql as $$
begin
  if new.person_id is not null then
    update people set is_client = true where id = new.person_id;
  end if;
  return new;
end $$;
create trigger trg_project_client after insert on projects for each row execute function mark_person_as_client();

-- Soma de pontos no perfil
create or replace function apply_points() returns trigger language plpgsql security definer as $$
begin
  if tg_op = 'INSERT' then update profiles set points = points + new.points where id = new.owner_id;
  elsif tg_op = 'DELETE' then update profiles set points = points - old.points where id = old.owner_id; end if;
  return null;
end $$;
create trigger trg_points after insert or delete on point_events for each row execute function apply_points();
