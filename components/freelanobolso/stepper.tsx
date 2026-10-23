import Link from "next/link";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/** Stepper lateral dos wizards (propostas e contratos). Passos já criados são navegáveis. */
export function Stepper({
  passos,
  atual,
  href,
}: {
  passos: readonly { slug: string; label: string; descricao: string }[];
  atual: string;
  href: (slug: string) => string;
}) {
  const indiceAtual = passos.findIndex((p) => p.slug === atual);

  return (
    <ol className="flex gap-2 overflow-x-auto lg:flex-col lg:gap-0">
      {passos.map((p, i) => {
        const feito = i < indiceAtual;
        const ativo = i === indiceAtual;
        return (
          <li key={p.slug} className="relative shrink-0 lg:pb-8 lg:last:pb-0">
            {i < passos.length - 1 && (
              <span
                aria-hidden
                className={cn(
                  "absolute left-4 top-10 hidden h-[calc(100%-48px)] w-0.5 lg:block",
                  feito ? "bg-primaria-600" : "bg-neutro-200",
                )}
              />
            )}
            <Link
              href={href(p.slug)}
              aria-current={ativo ? "step" : undefined}
              className="flex items-start gap-3 rounded-lg p-1 pr-3 hover:bg-neutro-100/60"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold",
                  feito && "border-primaria-600 bg-primaria-600 text-branco",
                  ativo && "border-primaria-600 bg-primaria-50 text-primaria-600 ring-4 ring-primaria-100",
                  !feito && !ativo && "border-neutro-200 bg-branco text-neutro-500",
                )}
              >
                {feito ? <Check className="size-4" /> : i + 1}
              </span>
              <span className="pt-1">
                <span className={cn("block text-sm font-semibold", ativo ? "text-primaria-700" : "text-neutro-700")}>
                  {p.label}
                </span>
                <span className="texto-pequeno hidden lg:block">{p.descricao}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}
