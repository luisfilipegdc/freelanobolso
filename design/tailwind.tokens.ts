// Cole em tailwind.config.ts -> theme.extend
const scale = (name: string, steps: number[]) =>
  Object.fromEntries(steps.map((s) => [s, `var(--${name}-${s})`]));
const S = [25, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export const freelaNoBolsoTheme = {
  fontFamily: { sans: ["Inter", "system-ui", "sans-serif"] },
  colors: {
    primaria: scale("primaria", S),
    neutro: scale("neutro", S),
    sucesso: scale("sucesso", S),
    erro: scale("erro", S),
    alerta: scale("alerta", S),
    rosa: scale("rosa", [50, 500, 600, 700]),
    bronze: { DEFAULT: "var(--bronze)", escuro: "var(--bronze-escuro)" },
    canvas: "var(--canvas)",
  },
};
