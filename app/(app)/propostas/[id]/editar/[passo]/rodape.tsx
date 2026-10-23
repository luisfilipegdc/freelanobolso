import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { SubmitButton } from "@/components/freelanobolso/submit-button";

/** Rodapé dos passos do wizard: Voltar + botão de continuar. */
export function RodapePasso({ voltar, pending, children }: { voltar?: string; pending: boolean; children: string }) {
  return (
    <div className="flex flex-col-reverse gap-3 border-t border-neutro-200 pt-6 sm:flex-row sm:justify-between">
      {voltar ? (
        <Link href={voltar} className={buttonVariants({ variant: "secondary" })}>
          <ArrowLeft />
          Voltar
        </Link>
      ) : (
        <span />
      )}
      <SubmitButton pending={pending} pendingText="Salvando…">
        {children}
      </SubmitButton>
    </div>
  );
}
