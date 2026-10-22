"use client";

import { useState, useTransition } from "react";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { excluirServico } from "./actions";
import type { Servico } from "@/lib/servicos";
import { ServicoDialog } from "./servico-form";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/freelanobolso/toast";

/** Menu ⋯ do card: Editar e Excluir. */
export function ServicoMenu({ servico }: { servico: Servico }) {
  const toast = useToast();
  const [editando, setEditando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState<string>();
  const [pending, startTransition] = useTransition();

  const excluir = () =>
    startTransition(async () => {
      const result = await excluirServico(servico.id);
      if (result.error) return setErro(result.error);
      toast.sucesso("Serviço excluído.");
      setExcluindo(false);
    });

  return (
    <>
      <DropdownMenu label={`Ações para ${servico.name}`}>
        <DropdownItem onClick={() => setEditando(true)}>
          <Pencil />
          Editar
        </DropdownItem>
        <DropdownItem destructive onClick={() => setExcluindo(true)}>
          <Trash2 />
          Excluir
        </DropdownItem>
      </DropdownMenu>

      <ServicoDialog open={editando} onClose={() => setEditando(false)} servico={servico} />

      <Dialog
        open={excluindo}
        onClose={() => setExcluindo(false)}
        tone="erro"
        icon={<Trash2 />}
        title={`Excluir ${servico.name}?`}
        description="As propostas e contratos que já usam este serviço permanecerão intactos. Você perderá os 5 pontos que ganhou ao cadastrá-lo."
      >
        {erro && <Alert>{erro}</Alert>}
        <DialogActions>
          <Button variant="secondary" onClick={() => setExcluindo(false)} disabled={pending}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={excluir} disabled={pending}>
            {pending && <Loader2 className="animate-spin" />}
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
