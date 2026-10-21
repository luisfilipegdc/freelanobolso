/** Opções do "Nos conte mais sobre você" (docs/03-telas.md), reaproveitadas em Configurações. */

export const AREAS_DE_ATUACAO = [
  "UX/UI Design",
  "Programação Convencional",
  "Programação Low-code/No-code",
  "Edição de Vídeo",
  "Copywriting",
  "Gestão de Mídias Sociais",
  "Outros",
] as const;

// Suposição: o Figma só mostra o primeiro item de cada select; as demais faixas seguem o mesmo padrão.
export const TAMANHOS_DE_EQUIPE = ["Apenas eu", "2 a 5 pessoas", "6 a 10 pessoas", "Mais de 10 pessoas"] as const;

export const FAIXAS_DE_FATURAMENTO = [
  "Até R$3.000 por mês",
  "Entre R$3.000 e R$6.000 por mês",
  "Entre R$6.000 e R$10.000 por mês",
  "Entre R$10.000 e R$20.000 por mês",
  "Mais de R$20.000 por mês",
] as const;
