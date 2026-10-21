/** Saudação da tela Início conforme o horário de Brasília. */
export function saudacao(agora = new Date()) {
  const hora = Number(
    new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hourCycle: "h23", timeZone: "America/Sao_Paulo" }).format(agora),
  );
  if (hora >= 5 && hora < 12) return "Bom dia";
  if (hora >= 12 && hora < 18) return "Boa tarde";
  return "Boa noite";
}

// Suposição: o Figma mostra uma citação de exemplo; esta lista segue o mesmo tom.
const CITACOES = [
  "“Freelancer organizado ganha mais. Simples assim.”",
  "“O sucesso é a soma de pequenos esforços repetidos dia após dia.” — Robert Collier",
  "“Feito é melhor que perfeito.”",
  "“A melhor maneira de prever o futuro é criá-lo.” — Peter Drucker",
  "“Disciplina é a ponte entre metas e realizações.” — Jim Rohn",
];

/** Uma citação por dia, igual para todo mundo naquele dia. */
export function citacaoDoDia(agora = new Date()) {
  const dia = Math.floor(agora.getTime() / 86_400_000);
  return CITACOES[dia % CITACOES.length];
}
