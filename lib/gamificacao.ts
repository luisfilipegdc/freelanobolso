/**
 * Níveis e ligas (docs/06-gamificacao.md).
 * Pontos para passar do nível N para o N+1: 20 × N + 40.
 * Ligas: Bronze (1–9), Prata (10–19), Ouro (20+).
 */

export type Liga = "Bronze" | "Prata" | "Ouro";

export type Nivel = {
  nivel: number;
  liga: Liga;
  /** Pontos acumulados dentro do nível atual. */
  pontosNoNivel: number;
  /** Pontos necessários para chegar ao próximo nível. */
  pontosParaProximo: number;
};

export function pontosParaSubir(nivel: number) {
  return 20 * nivel + 40;
}

export function ligaDoNivel(nivel: number): Liga {
  if (nivel >= 20) return "Ouro";
  if (nivel >= 10) return "Prata";
  return "Bronze";
}

export function calcularNivel(pontos: number): Nivel {
  let nivel = 1;
  let restante = Math.max(0, pontos);
  while (restante >= pontosParaSubir(nivel)) {
    restante -= pontosParaSubir(nivel);
    nivel += 1;
  }
  return {
    nivel,
    liga: ligaDoNivel(nivel),
    pontosNoNivel: restante,
    pontosParaProximo: pontosParaSubir(nivel),
  };
}
