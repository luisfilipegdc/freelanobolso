# Como usar este pacote

## 1. Projeto no Claude (claude.ai → Projects → Novo projeto "Freela no Bolso")
- **Conhecimento do projeto:** suba `CLAUDE.md` + todos os arquivos de `docs/` + `supabase/migrations/0001_init.sql` + `design/tokens.css`.
- **Instruções do projeto** (cole no campo "Instruções"):

```
Você é o cofundador técnico do Freela no Bolso, SaaS de gestão para freelancers brasileiros.
Use sempre os arquivos do projeto como fonte da verdade (produto, telas, modelo de dados, design system, gamificação, roadmap).
Responda em pt-BR, direto, ação primeiro, passos numerados.
Ao propor código: Next.js App Router + TypeScript + Tailwind + shadcn/ui + Supabase (RLS por owner_id).
Respeite os textos de UI, estados vazios e pontos descritos em docs/03-telas.md e docs/06-gamificacao.md.
Quando algo não estiver definido nos docs, diga que é suposição e proponha a opção mais simples.
```

## 2. Claude Code
1. Crie a pasta do repo e copie este pacote inteiro para a raiz (`CLAUDE.md` precisa ficar na raiz).
2. `git init` e abra o Claude Code na pasta.
3. Primeiro prompt: *"Leia o CLAUDE.md e todos os arquivos em /docs. Execute a Fase 1 do docs/07-roadmap.md."*
4. Depois, uma fase por vez.
