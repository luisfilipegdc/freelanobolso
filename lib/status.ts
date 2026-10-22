/** Rótulos e cores dos status (docs/04-modelo-dados.md). */

type Cor = "neutro" | "primaria" | "sucesso" | "alerta" | "erro" | "rosa";

export const STATUS_PROJETO: Record<string, { label: string; cor: Cor }> = {
  aguardando_inicio: { label: "Aguardando Início", cor: "alerta" },
  em_andamento: { label: "Em andamento", cor: "primaria" },
  concluido: { label: "Concluído", cor: "sucesso" },
  cancelado: { label: "Cancelado", cor: "neutro" },
};

export const TIPO_PROJETO: Record<string, string> = {
  unico: "Projeto Único",
  recorrente_mensal: "Recorrente mensal",
};

export const STATUS_PROPOSTA: Record<string, { label: string; cor: Cor }> = {
  rascunho: { label: "Rascunho", cor: "neutro" },
  enviada: { label: "Aguardando Resposta", cor: "alerta" },
  visualizada: { label: "Visualizada", cor: "primaria" },
  aceita: { label: "Aceita", cor: "sucesso" },
  rejeitada: { label: "Rejeitada", cor: "erro" },
  expirada: { label: "Expirada", cor: "neutro" },
};

export const STATUS_CONTRATO: Record<string, { label: string; cor: Cor }> = {
  rascunho: { label: "Rascunho", cor: "neutro" },
  aguardando_assinatura: { label: "Aguardando Assinatura", cor: "alerta" },
  assinado: { label: "Assinado", cor: "sucesso" },
  terminado: { label: "Terminado", cor: "neutro" },
  cancelado: { label: "Cancelado", cor: "erro" },
};
