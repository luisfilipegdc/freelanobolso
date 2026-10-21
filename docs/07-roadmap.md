# 07 — Roadmap de construção (ordem para o Claude Code)

Cada fase termina com app rodando e testável. Peça ao Claude Code uma fase por vez.

1. **Fundação** — scaffold Next.js + Tailwind + shadcn, tokens (`design/`), Supabase local, migration 0001, auth (Entrar, Criar conta, Informações opcionais), layout com sidebar + card da conta.
2. **Pessoas + Serviços** — listagens com busca/abas/estado vazio, modais de criar/excluir, detalhes da pessoa (aba Dados PF/PJ com máscaras e busca de CEP via ViaCEP), pontos.
3. **Propostas** — wizard 4 passos com preview, página pública `/proposta/[slug]`, enviar (copiar link/WhatsApp/email), rastrear `viewed_at`, aceitar/rejeitar.
4. **Contratos** — wizard 4 passos, template de cláusulas com valor por extenso, assinatura eletrônica (contratado e contratante, IP, hash, PDF), página pública `/contrato/[slug]`.
5. **Projetos** — criar (manual ou "Transformar em projeto"), abas Dados/Tarefas/Pagamentos/Documentos/Atualizações, Área do Cliente pública `/c/[slug]`.
6. **Finanças** — movimentações, KPIs por período, pendente por projeto, recibo em PDF.
7. **Início + Gamificação** — dashboard, checklist de onboarding, níveis, conquistas, modal de nível.
8. **Monetização** — trial 14 dias, modal "trial acabando" + feedback, checkout (Stripe/Asaas), Configurações › Cobranças.
9. **Ajuda + Landing** — FAQ, suporte, landing page (copy em `08-marketing.md`).

## Prompt inicial sugerido para o Claude Code
> Leia o CLAUDE.md e todos os arquivos em /docs. Execute a Fase 1 do docs/07-roadmap.md. Ao final, me mostre o que foi criado e como rodar.
