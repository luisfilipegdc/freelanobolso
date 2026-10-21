# 02 — Arquitetura da Informação

Legenda do Figma: Conjunto de Páginas › Página › Seção, Aba ou Modal.

## Público (sem login)
- Landing Page → Criar Conta → Informações opcionais → Onboarding (Início)
- Login (Entrar) → Esqueci a senha
- `/proposta/[slug]` — Proposta (visão do cliente): Aceitar proposta / Enviar mensagem
- `/contrato/[slug]` — Contrato (visão do cliente): Assinar contrato → Contrato assinado
- `/c/[slug]` — Área do Cliente (por projeto)

## App (logado) — menu lateral
```
Início
Pessoas ─┬─ Adicionar Pessoa (modal PF/PJ)
         └─ Detalhes da Pessoa: abas Dados | Projetos | Pagamentos | Documentos
            └─ Excluir Pessoa (modal)
Projetos ─┬─ Adicionar Projeto (modal)
          └─ Detalhes do Projeto: abas Dados | Tarefas | Pagamentos | Documentos | Atualizações | Área do Cliente
             └─ Enviar atualização para o cliente (modal)
Propostas ─┬─ Criar Proposta (modal nome) → Wizard: 1 Dados Gerais › 2 Serviços › 3 Condições › 4 Revisão
           ├─ Enviar Proposta (modal) → Proposta Enviada
           ├─ Detalhes da Proposta
           └─ Transformar em Contrato / Transformar em Projeto
Contratos ─┬─ Criar Contrato → Wizard: 1 Identificação › 2 Serviços › 3 Condições › 4 Revisão (Assinar e enviar)
           ├─ Enviar Contrato (modal) → Contrato enviado
           └─ Detalhes do Contrato
Serviços (Meu Negócio) ── Criar / Editar / Excluir Serviço (modais)
Finanças ── Registrar Movimentação (Receita | Gasto) / Detalhes / Excluir
Pontuação ── Nível, Progresso, Conquistas
Configurações ── Meus dados (Dados Básicos) | Dados para Documentos (PF/PJ) | Plano e Extrato (Cobranças)
                 └─ Alterar Senha / Alterar Email / Alterar Cartão
Ajuda ── FAQ + Solicitar suporte (modal)
```

## Fluxos transversais
- **Trial acabando** (faltam 2 dias) → "Quero continuar" (checkout) | "Não tenho interesse" → Feedback → Obrigado.
- **Subiu de nível** → modal de parabéns.
- **Feedback** → Feedback enviado.
- **Ciclo comercial:** Lead → Proposta → (aceita) → Contrato → (assinado) → Projeto → Pagamentos → Concluído. Lead vira **Cliente** quando recebe um projeto.

## Rotas sugeridas (Next.js)
```
/(marketing)/page.tsx
/(auth)/entrar, /criar-conta, /criar-conta/sobre-voce
/(app)/inicio, /pessoas, /pessoas/[id]/(dados|projetos|pagamentos|documentos)
/(app)/projetos, /projetos/[id]/(dados|tarefas|pagamentos|documentos|atualizacoes|area-do-cliente)
/(app)/propostas, /propostas/nova/[step], /propostas/[id]
/(app)/contratos, /contratos/novo/[step], /contratos/[id]
/(app)/servicos, /financas, /pontuacao, /configuracoes/(dados|documentos|plano), /ajuda
/(public)/proposta/[slug], /contrato/[slug], /c/[slug]
```
