import type { Metadata } from "next";
import { citacaoDoDia, saudacao } from "@/lib/saudacao";

export const metadata: Metadata = { title: "Início" };

export default function InicioPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="border-b border-neutro-200 pb-5">
        <h1 className="h1">{saudacao()}, vamos trabalhar?</h1>
        <p className="citacao mt-1">{citacaoDoDia()}</p>
      </header>

      {/* Checklist de onboarding, atalhos, finanças, projetos e atualizações chegam na Fase 7. */}
    </div>
  );
}
