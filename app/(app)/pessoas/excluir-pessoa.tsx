"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { excluirPessoa } from "./actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { useToast } from "@/components/freelanobolso/toast";

/** Modal "Excluir pessoa". Após excluir, volta para a listagem se `voltar` for true. */
export function ExcluirPessoa({
  id,
  name,
  open,
  onClose,
  voltar,
}: {
  id: string;
  name: string;
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
      const result = await excluirPessoa(id);
      if (result.error) return setErro(result.error);
      toast.sucesso("Pessoa excluída.");
      onClose();
      if (voltar) router.push("/pessoas");
    });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      tone="erro"
      icon={<Trash2 />}
      title={`Excluir ${name}?`}
      description={
        <>
          Tudo atrelado a esta pessoa (projetos, documentos, pagamentos, etc.) será excluído para sempre. Você também
          perderá os 2 pontos que ganhou ao cadastrá-la.
        </>
      }
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
