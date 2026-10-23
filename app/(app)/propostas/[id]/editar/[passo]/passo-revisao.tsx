import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ConfirmarEnvio } from "./confirmar-envio";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { PropostaDocumento } from "@/components/freelanobolso/proposta-documento";
import { pendenciasParaEnvio } from "@/lib/propostas";
import type { PropostaCompleta } from "@/lib/propostas-server";

export function PassoRevisao({ proposta }: { proposta: PropostaCompleta }) {
  const faltando = pendenciasParaEnvio({ person_id: proposta.person_id, itens: proposta.items.length });

  return (
    <div className="flex flex-col gap-6">
      <p className="texto-grande">É exatamente assim que o seu cliente vai ver a proposta.</p>
      {faltando.length > 0 && <Alert>Antes de enviar, {faltando.join(" e ")}.</Alert>}

      <PropostaDocumento proposta={proposta} />

      <div className="flex flex-col-reverse gap-3 border-t border-neutro-200 pt-6 sm:flex-row sm:justify-between">
        <Link href={`/propostas/${proposta.id}/editar/condicoes`} className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft />
          Voltar
        </Link>
        <ConfirmarEnvio id={proposta.id} disabled={faltando.length > 0} />
      </div>
    </div>
  );
}
