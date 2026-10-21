import { calcularNivel } from "@/lib/gamificacao";

/** Liga + nível + barra "X de Y pontos" (card da conta e página Pontuação). */
export function LevelProgress({ points }: { points: number }) {
  const { nivel, liga, pontosNoNivel, pontosParaProximo } = calcularNivel(points);
  const pct = Math.round((pontosNoNivel / pontosParaProximo) * 100);

  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-xs font-medium text-bronze">
        {liga} - Nível {nivel}
      </p>
      <div
        className="h-2 overflow-hidden rounded-full bg-neutro-200"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={pontosParaProximo}
        aria-valuenow={pontosNoNivel}
        aria-label={`Progresso do nível ${nivel}`}
      >
        <div className="h-full rounded-full bg-primaria-600" style={{ width: `${pct}%` }} />
      </div>
      <p className="texto-pequeno">
        {pontosNoNivel} de {pontosParaProximo} pontos
      </p>
    </div>
  );
}
