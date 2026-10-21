# Freela no Bolso

Gestão para freelancers e micro agências brasileiras: pessoas, serviços, projetos, propostas, contratos com assinatura eletrônica, finanças, área do cliente e gamificação.

> Freelancer organizado ganha mais. Simples assim.

## Rodando localmente

Pré-requisitos: Node 20+, pnpm e Docker (para o Supabase local).

```bash
pnpm install
pnpm supabase start          # sobe Postgres, Auth etc.
pnpm supabase db reset       # aplica supabase/migrations + supabase/seed.sql
cp .env.example .env.local   # cole a URL e a Publishable key de `pnpm supabase status`
pnpm dev
```

Abra http://localhost:3000 e crie uma conta. Os emails do Supabase local (recuperação de senha) aparecem no Mailpit: http://127.0.0.1:54324.

## Documentação

Comece pelo [`CLAUDE.md`](CLAUDE.md) e pela pasta [`docs/`](docs) — produto, arquitetura da informação, telas, modelo de dados, design system, gamificação e roadmap.
