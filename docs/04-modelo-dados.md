# 04 — Modelo de dados

SQL completo em `supabase/migrations/0001_init.sql`. Todas as tabelas têm `owner_id uuid` (= auth.uid()) e RLS.

```
profiles (1:1 auth.users)  ── dados do freelancer, dados p/ documentos, plano, pontos
people                     ── clientes e leads (PF/PJ); status derivado: cliente se tem projeto
services                   ── catálogo (nome, descrição, preço)
proposals ── proposal_items (service_id, qty, price)
contracts ── contract_items ; contracts.proposal_id opcional
projects  ── project_services ; project_tasks ; projects.proposal_id / contract_id opcionais
transactions               ── receita | gasto, categoria, project_id opcional
project_updates            ── feed (tarefa concluída, pagamento, assinatura…), visível na Área do Cliente
point_events               ── ledger de pontos (ação, pontos, ref)
achievements / user_achievements
support_tickets, trial_feedback
```

## Relações-chave
- `people 1—N projects`, `people 1—N proposals`, `people 1—N contracts`
- `proposal → contract → project` (cada passo guarda FK do anterior)
- `projects 1—N transactions (type = receita)` → valor pago × valor total = pendente
- Lead vira cliente: `people.kind` derivado (`exists(projects)`), ou coluna atualizada por trigger.

## Status
- proposal: `rascunho | enviada | visualizada | aceita | rejeitada | expirada`
- contract: `rascunho | aguardando_assinatura | assinado | terminado | cancelado`
- project: `aguardando_inicio | em_andamento | concluido | cancelado` + prazo calculado (`no_prazo | atrasado`)

## Links públicos
`proposals.public_slug`, `contracts.public_slug`, `projects.client_area_slug` — slug legível + sufixo aleatório (ex.: `petshop-aumigo-18692058138`). Acesso público via Edge Function/route handler com service role, nunca expondo a tabela inteira.

## Assinatura eletrônica
`contract_signatures` (contract_id, party: contratado|contratante, name, cpf, ip, user_agent, signed_at, hash_documento). Registrar `viewed_at` para "saber quando o cliente leu".
