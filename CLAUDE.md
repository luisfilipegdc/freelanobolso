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

## Stack
- Next.js 16 (App Router) + TypeScript + Tailwind v4 + componentes no padrão shadcn/ui
  - Next 16: `middleware` agora se chama **`proxy.ts`**; `params`/`searchParams`/`cookies()` são assíncronos. Na dúvida, leia `node_modules/next/dist/docs/`.
  - Tailwind v4 não usa `tailwind.config.ts`: os tokens de `design/tokens.css` viram classes (`bg-primaria-600`, `text-neutro-700`…) via `@theme` em `app/globals.css`. `design/tailwind.tokens.ts` fica só como referência.
  - `components.json` está pronto para `pnpm dlx shadcn@latest add <componente>`; as variáveis do shadcn (`--primary`, `--border`…) já apontam para os tokens.
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

## Estrutura
- `app/(auth)` — Entrar, Criar conta, Nos conte mais sobre você, Esqueci/Redefinir senha; Server Actions em `app/(auth)/actions.ts`
- `app/(app)` — área logada (sidebar + card da conta); `app/auth/callback` — retorno do Supabase Auth
- `lib/supabase/` — clientes browser/server e renovação de sessão usada pelo `proxy.ts` (que também protege as rotas)
- `lib/auth.ts` (`getPerfil`), `lib/gamificacao.ts` (níveis/ligas), `lib/opcoes.ts` (listas de seleção)
- `lib/acoes.ts` — `exigirUsuario()` e o tipo `ActionState` das Server Actions; `hooks/use-action-form.ts` envia o form sem apagar os campos em caso de erro
- `lib/mascaras.ts` — máscaras/validação de CPF, CNPJ, CEP, telefone e R$; `components/freelanobolso/masked-input.tsx` (`MaskedInput`, `MoneyInput`)
- Propostas: wizard em `app/(app)/propostas/[id]/editar/[passo]` (o rascunho é criado antes); `components/freelanobolso/proposta-documento.tsx` desenha a proposta (revisão, detalhes e link público); `lib/propostas.ts` tem totais, status e slug.
- **Links públicos** (`app/proposta/[slug]`) não leem tabelas: usam funções `security definer` do banco (`proposta_publica`, `registrar_visualizacao_proposta`, `responder_proposta` em `0004_propostas.sql`). Siga o mesmo padrão para contrato e Área do Cliente.
- **Pontos são dados pelo banco**: triggers em `0003_pessoas_servicos.sql` (`award_points`) gravam/apagam `point_events` ao criar/excluir. O app só mostra o toast com `useToast().pontos(n)`. Para uma nova ação pontuada, crie o trigger na migration.

## Comandos
```bash
pnpm install
pnpm supabase start      # banco local (Docker)
pnpm supabase db reset   # aplica migrations + seed
cp .env.example .env.local   # preencha com a saída de `pnpm supabase status`
pnpm dev                 # app em http://localhost:3000
pnpm lint && pnpm build  # checagens antes de commitar
```

## Progresso do roadmap
- [x] Fase 1 — Fundação
- [x] Fase 2 — Pessoas + Serviços
- [x] Fase 3 — Propostas
- [ ] Fase 4 — Contratos (as demais páginas do menu mostram "Em construção")
