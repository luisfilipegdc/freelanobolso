# 03 — Telas (extraído do Figma "Protótipo - Componentizado")

Layout padrão do app: sidebar à esquerda (logo Freela no **Bolso**, menu, card da conta "Tiago Costa · Bronze - Nível 7" com barra de pontos), conteúdo à direita com título h1 + descrição (texto-grande) + ações à direita.

---

## Auth
### Entrar
"Insira suas credenciais abaixo" · Email · Senha · [ ] Permanecer conectado · Esqueci a senha · **Entrar** · "Ainda não é cadastrado? Crie uma conta" · Sign in with Google.

### Criar conta
"Inicie o seu teste grátis de 14 dias. Pode ficar tranquilo, não pedimos seu cartão de crédito! :)"
Campos: Nome (Ex.: Tiago Costa) · Nome da sua Empresa (opcional, Ex.: Costa Design) · Email · Senha ("Deve ter pelo menos 8 caracteres").
Aceite: "Ao clicar em 'Criar conta', você concorda com os Termos de Uso e Política de Privacidade".

### Criar conta — Informações opcionais ("Nos conte mais sobre você")
- Áreas de atuação (multi): UX/UI Design, Programação Convencional, Programação Low-code/No-code, Edição de Vídeo, Copywriting, Gestão de Mídias Sociais, Outros
- Tamanho da Equipe (select, ex.: Apenas eu)
- Faturamento Mensal (select, ex.: Entre R$3.000 e R$6.000 por mês)
- Botões: **Continuar para a plataforma** · Pular perguntas · nota de privacidade.

---

## Início
- Saudação dinâmica: "Boa tarde, vamos trabalhar?" + citação motivacional (estilo `citacao`).
- **Checklist de onboarding** "Comece sua jornada com o pé direito": Criar uma conta ✓ · Completar seus Dados · Cadastrar seus serviços.
- **O que gostaria de fazer?** atalhos: Cadastrar um lead · Criar um projeto · Criar uma proposta · Criar um contrato · Registrar uma movimentação.
- **Suas finanças** (mês atual): Receita · Gastos · Lucro + "Ver mais".
- **Seus projetos**: cards com status (Aguardando Início, "Conclui em 3 dias", "Inicia em 5 dias") e valor.
- **Últimas atualizações** (feed de eventos dos projetos).

---

## Pessoas
Descrição: "Cadastre as pessoas que têm relação com o seu negócio, tanto clientes como leads, e acompanhe seu histórico com cada um."
- Abas: Todos · Clientes · Leads. Busca "Busque uma pessoa". Tabela: Pessoa (avatar+nome+badge Lead), contato, ações (⋯: Enviar WhatsApp, Enviar email, Ver detalhes, Excluir).
- **Vazio:** "Você ainda não tem pessoas cadastradas" — "Que mundo de oportunidades! Com apenas um nome você já pode começar…" → **Adicionar a primeira pessoa**.

### Modal Adicionar pessoa (+2 pontos)
"Toda pessoa será adicionada como um lead… Quando você criar um projeto e atribuir ao lead, ele se tornará um cliente."
Tipo: Pessoa Física | Pessoa Jurídica.
- PF: Nome · Email (opc.) · Telefone (opc.)
- PJ: Empresa · Nome do Representante · Email/Telefone do Representante (opc.)

### Detalhes da Pessoa
Header: "Voltar para Pessoas", nome, "Cliente adicionado em dd/mm/aaaa", botões **Criar Projeto** · **Registrar Pagamento**.
Abas:
1. **Dados** — *Dados Básicos*: Tipo, Nome, Email, Telefone, Foto ("será vista pelo cliente na área do cliente"; SVG/PNG/JPG/GIF máx 800x400). *Dados para Documentos*: PF → CPF, CEP, Endereço, Número, Complemento, Cidade, Estado. PJ → Razão Social, CNPJ, CPF do Representante + endereço. Botão "Salvar alterações" por seção.
2. **Projetos** — filtros Todos/Em andamento/Concluídos; colunas Projeto, Tipo (Projeto Único), Status, Prazo (No prazo/Atrasado), Valor Pago "R$ 1.000,00 de R$ 2.000,00".
3. **Pagamentos** — Data, Descrição, Valor.
4. **Documentos** — Documento (Proposta/Contrato), Status (Aguardando Resposta, Assinado).

### Modal Excluir pessoa
"Tudo atrelado a esta pessoa (projetos, documentos, pagamentos, etc.) será excluído para sempre." Perde os pontos.

---

## Projetos
Descrição: "Acompanhe e gerencie os seus projetos de forma integrada e inteligente."
- Filtros: Todos · Em andamento · Concluídos · Cancelados. Card/linha: nome, cliente, status, valor.
- **Vazio:** "Você ainda não criou projetos — O projeto é o coração do seu negócio… começar a ficar rico... ou quase isso :)" → **Criar meu primeiro projeto**.

### Modal Criar projeto (+10 pontos)
Título · Cliente · Tipo de Projeto (Projeto único | Serviço recorrente por mês) · Valor · Data de início.

### Detalhes do Projeto (abas)
- **Dados**: cliente (email, telefone ou "não cadastrado, clique para adicionar"), Valor pendente, Data de Início, Data estimada de entrega, serviços.
- **Tarefas**: tarefas por serviço (ex.: "Marcar entrevistas" no serviço "Pesquisa com Usuários"); concluir gera atualização.
- **Pagamentos**: Descrição (ex.: "Entrada - Petshop Aumigo"), Data, Valor.
- **Documentos**: propostas/contratos vinculados ("Criado em…"); "Não encontrou o documento? Encontrar documento"; ⋯ Desvincular do projeto.
- **Atualizações**: feed ("Marcou a tarefa X como Concluída", "Realizou um pagamento de R$ 1.500,00", "Assinou o Contrato", "Criou o projeto").
- **Área do Cliente**: imagem de capa, link `freelanobolso.com.br/projeto/<slug>`, "Enviar link para o cliente" (WhatsApp/Email/Copiar). Modal **Enviar atualizações**: período (Últimos 7 dias) ou "Ainda não lidas".

---

## Propostas
Descrição: "Automatize a criação de propostas comerciais de alta conversão e acompanhe o status de cada uma."
- Abas: Todas · Rascunhos · Aceitas · Rejeitadas. Status: Rascunho, Enviada, Visualizada, Aceita, Rejeitada.
- ⋯: Ver detalhes · Enviar por WhatsApp · Enviar por Email · Copiar Link · Excluir.
- **Vazio:** "Você ainda não criou propostas — em menos de 1 minuto e com apenas alguns cliques…" → **Criar minha primeira proposta**.

### Wizard Criar Proposta (stepper lateral + preview "Estrutura da Proposta")
1. **Dados Gerais** — Nome do Projeto, Imagem de Capa (936x312), Cliente, Objetivo ("Qual o objetivo do cliente com este projeto?"), Apresentação (texto sobre você — vem do perfil), [x] Esta proposta tem Data de Vencimento → data. → "Continuar para os serviços"
2. **Serviços** — "Liste os serviços que serão executados e adicione um desconto." Linhas: serviço (do catálogo), quantidade, preço. Adicionar serviço. Subtotal, Desconto (%), Total. → "Continuar para as condições"
3. **Condições** — Prazo (N dias corridos/úteis, "Começando hoje: dd/mm"), Estrutura do Pagamento (À vista | Parcelado), Descrição das Parcelas ("50% na entrada, 50% na entrega"), Meio de Pagamento (PIX, Boleto, Cartão de Crédito), Observações. → "Continuar para revisão"
4. **Revisão** — preview fiel → "Confirmar e preparar envio".

Estrutura da proposta pública: Capa · Informações (Para, De, data) · Apresentação · Objetivo · Serviços (descrição + preço) · Desconto · Prazo · Pagamento · Observações · CTA "Vamos trabalhar juntos — Enviar mensagem / Aceitar proposta" · rodapé "Proposta elaborada utilizando o Freela no Bolso, isto é um sinal de que este freelancer é organizado! :)".

### Modal Enviar proposta
Link `freelanobolso.com.br/proposta/<slug>`; mostra email e WhatsApp do cliente; "Ao copiar o link, a proposta será considerada como Enviada."
Proposta aceita → banner "A proposta X foi aceita!" → **Transformar em contrato** / **Transformar em projeto**.

---

## Contratos
Descrição: "Automatize a criação de contratos com validade jurídica, agilize sua rotina com a assinatura eletrônica e acompanhe o status de cada um."
- Abas: Todos · Aguardando Assinatura · Assinados · Terminados.
- **Vazio:** "Contratos são coisas super difíceis e demoradas de montar, né? Nãao!…" → **Criar meu primeiro contrato**.

### Wizard Criar Contrato
1. **Identificação** — "Forneça os dados para identificação do seu cliente, o CONTRATANTE." Tipo de Cliente (PF/PJ) + dados para documentos.
2. **Serviços** — igual à proposta.
3. **Condições** — prazo, pagamento, parcelas, Chave PIX.
4. **Revisão** — "Revise os termos do contrato, assine de maneira eletrônica e envie para o seu cliente." → **Assinar e enviar**.

### Template do contrato (cláusulas)
Partes (CONTRATANTE/CONTRATADO com CPF/CNPJ, endereço, email, telefone) · Objeto (cl. 1: serviços listados) · Prazo (cl. 2: inicia na entrega dos materiais ou pagamento do sinal) · Trabalhos adicionais = nova proposta (cl. 3) · Crédito autoral lei 9.610/98 e uso em portfólio (cl. 4) · Pagamento (cl. 5: valor por extenso + parcelas + PIX) · Rescisão (cl. 6–7: multa; 50% em desistência antes do início) · Assinatura eletrônica Freela no Bolso, MP 2.200-2 (cl. 8) · Foro (cl. 9) · local/data · assinaturas.

### Modal Enviar contrato
Link `freelanobolso.com.br/contrato/<slug>`; "Ao copiar o link, o contrato será considerado como Enviado."

---

## Serviços
"Cadastre os serviços que presta atualmente e monte propostas e contratos em segundos."
Card: nome, descrição, preço. Modal **Adicionar Serviço** (+5 pontos): Nome · Preço (opcional) · Descrição (opcional) — dica: "este texto será utilizado nas propostas e contratos…". Excluir: "o que já foi construído permanecerá intacto".
**Vazio:** "Você ainda não cadastrou serviços" → **Criar meu primeiro serviço**.

---

## Finanças
"Controle seus gastos e ganhos, acompanhe o seu lucro e os pagamentos pendentes."
- Período: Mês atual · Mês passado · Ano atual · Período Customizado.
- KPIs: Receita · Gastos · Lucro (+ pendente a receber).
- Abas Entradas · Saídas; busca; tabela Data, Descrição, Categoria, Projeto, Valor.
- Modal **Registrar movimentação** (+1 ponto): Tipo (Receita | Gasto), Descrição, Valor, Data, Categoria (Ferramentas, Impostos…), Projeto (opcional).
- Excluir receita avisa: "O projeto X passará a ter R$ Y em pagamentos pendentes."
- **Vazio:** "Recebeu um pagamento? Assinou alguma ferramenta? Pagou impostos?…" → **Começar a organizar minhas finanças**.

---

## Pontuação
"Acompanhe o seu nível, suas medalhas... e aproveite a jornada! :)" — Nível + barra de progresso (ex. 50/180 pontos) + grid de Conquistas (ver `06-gamificacao.md`).

## Configurações
"Gerencie as informações e a identidade visual do seu negócio, bem como o seu plano e extrato no Freela no Bolso."
- **Dados Básicos / Identidade Visual**: Nome, Email, Senha, Data de nascimento, CPF, Telefone, Nome da Empresa ("Caso queira usar o seu próprio nome, basta repeti-lo"), Áreas de Atuação (tags), Foto/Logo, Apresentação. "Sair da conta".
- **Dados para Documentos**: Tipo de Negócio PF | PJ (razão social, CNPJ, endereço) — usado no contrato.
- **Cobranças**: Plano atual (Mensal R$99 / Anual R$79), Método de Pagamento (cartão final 1234, Editar), Histórico (Cobrança, Valor, Data, Situação Pago/Pendente).

## Ajuda
FAQ em acordeão + **Solicitar suporte** (Assunto, Descrição; "Iremos entrar em contato dentro de 1 dia").

## Modais globais
- **Trial acabando**: "Faltam apenas 2 dias…" → Quero continuar usando o Freela no Bolso | Não tenho interesse em assinar.
- **Feedback do trial**: motivos (Poucas funcionalidades, Preço alto, Não entendi como usar, Não sou freelancer, Outro) + texto → "Enviar e continuar usando o Freela no Bolso".
- **Passou de nível**: "Parabéns, você atingiu o Nível 8!…"
- Toast de pontos: "Parabéns, você ganhou 5 pontos!"
