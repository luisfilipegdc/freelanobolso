# Freela no Bolso — CLAUDE.md

SaaS de gestão para freelancers e micro agências brasileiras. Substitui Trello/Notion/planilhas/PDF de contrato por uma ferramenta só: **Pessoas (CRM), Serviços, Projetos, Propostas, Contratos com assinatura eletrônica, Finanças, Área do Cliente e Gamificação**.

Fonte da verdade do design: Figma "Freelup (cópia)" (nome original do arquivo; o produto agora se chama Freela no Bolso) — página **Protótipo - Componentizado** (telas) e **Arquitetura da Informação** (fluxos).

## Leia antes de codar
1. `docs/01-produto.md` — visão, persona, planos, concorrentes
2. `docs/02-arquitetura-informacao.md` — mapa de páginas e fluxos
3. `docs/03-telas.md` — cada tela: campos, estados vazios, modais, textos
4. `docs/04-modelo-dados.md` + `supabase/migrations/0001_init.sql`
5. `docs/05-design-system.md` + `design/tokens.css`
6. `docs/06-gamificacao.md` — pontos, níveis, conquistas
7. `docs/07-roadmap.md` — ordem de construção (MVP primeiro)

## Stack (padrão — ajuste se quiser)
- Next.js (App Router) + TypeScript + Tailwind + shadcn/ui
- Supabase: Auth, Postgres com RLS, Storage (fotos, capas, PDFs)
- Fonte: Inter. Ícones: lucide-react (o Figma usa set no estilo Untitled UI)
- Pagamento da assinatura: Stripe ou Asaas (decidir na fase 4)

## Regras do projeto
- **Idioma da UI: pt-BR.** Moeda `R$ 1.234,56`, datas `dd/mm/aaaa`, CPF/CNPJ/CEP/telefone com máscara.
- **Multi-tenant por usuário:** toda tabela tem `owner_id` → RLS `owner_id = auth.uid()`.
- **Rotas públicas** (sem login, via slug/token): `/proposta/[slug]`, `/contrato/[slug]`, `/c/[slug]` (Área do Cliente).
- **Toda ação relevante dá pontos** (ver `docs/06-gamificacao.md`). Excluir o item remove os pontos.
- **Estados vazios** existem em todas as listagens — usar os textos de `docs/03-telas.md`.
- Toasts de pontos: "Parabéns, você ganhou X pontos!".
- Componentes reutilizáveis em `components/ui` (shadcn) e `components/freelanobolso` (Stepper, StatusBadge, PointsBadge, EmptyState, MoneyInput, PersonAvatar).
- Nada de dados mockados no código final — usar seeds em `supabase/seed.sql`.

## Comandos (após scaffold)
```bash
pnpm dev            # app local
supabase start      # banco local
supabase db reset   # aplica migrations + seed
```
