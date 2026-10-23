"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Send } from "lucide-react";
import { prepararEnvio } from "../../../actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export function ConfirmarEnvio({ id, disabled }: { id: string; disabled: boolean }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string>();

  return (
    <div className="flex flex-col items-end gap-2">
      {erro && <Alert>{erro}</Alert>}
      <Button
        disabled={disabled || pending}
        onClick={() =>
          startTransition(async () => {
            const result = await prepararEnvio(id);
            if (result.error) return setErro(result.error);
            router.push(`/propostas/${id}?enviar=1`);
          })
        }
      >
        {pending ? <Loader2 className="animate-spin" /> : <Send />}
        Confirmar e preparar envio
      </Button>
    </div>
  );
}
