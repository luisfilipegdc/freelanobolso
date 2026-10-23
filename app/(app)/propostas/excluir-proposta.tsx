"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { excluirProposta } from "./actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { useToast } from "@/components/freelanobolso/toast";

export function ExcluirProposta({
  id,
  title,
  open,
  onClose,
  voltar,
}: {
  id: string;
  title: string;
  open: boolean;
  onClose: () => void;
  voltar?: boolean;
}) {
  const router = useRouter();
  const toast = useToast();
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string>();

  const excluir = () =>
    startTransition(async () => {
      const result = await excluirProposta(id);
      if (result.error) return setErro(result.error);
      toast.sucesso("Proposta excluída.");
      onClose();
      if (voltar) router.push("/propostas");
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      tone="erro"
      icon={<Trash2 />}
      title={`Excluir "${title}"?`}
      description="O link enviado ao cliente deixa de funcionar. Você também perderá os 5 pontos que ganhou ao criá-la."
    >
      {erro && <Alert>{erro}</Alert>}
      <DialogActions>
        <Button variant="secondary" onClick={onClose} disabled={pending}>
          Cancelar
        </Button>
        <Button variant="destructive" onClick={excluir} disabled={pending}>
          {pending && <Loader2 className="animate-spin" />}
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
