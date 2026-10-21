import { Hammer } from "lucide-react";
import { PageHeader } from "./page-header";

/** Página do menu cuja tela ainda não foi construída (ver docs/07-roadmap.md). */
export function EmConstrucao({ title, description, fase }: { title: string; description: string; fase: number }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader title={title} description={description} />
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutro-300 bg-branco px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-primaria-50 text-primaria-600">
          <Hammer className="size-6" />
        </span>
        <h2 className="h3">Em construção</h2>
        <p className="texto max-w-sm">Esta tela chega na Fase {fase} do roadmap.</p>
      </div>
    </div>
  );
}
