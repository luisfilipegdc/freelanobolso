"use client";

import { useState } from "react";
import { Package, Plus } from "lucide-react";
import { salvarServico } from "./actions";
import type { Servico } from "@/lib/servicos";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MoneyInput } from "@/components/freelanobolso/masked-input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";
import { useToast } from "@/components/freelanobolso/toast";
import { useActionForm } from "@/hooks/use-action-form";
import type { ActionState } from "@/lib/acoes";

/** Modal Adicionar Serviço (+5 pontos) ou Editar Serviço, conforme receba `servico`. */
export function ServicoDialog({ open, onClose, servico }: { open: boolean; onClose: () => void; servico?: Servico }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      icon={<Package />}
      title={servico ? "Editar serviço" : "Adicionar serviço"}
      description={servico ? undefined : "Cadastre um serviço que você presta e use-o nas suas propostas e contratos."}
    >
      {open && <FormServico servico={servico} onDone={onClose} />}
    </Dialog>
  );
}

function FormServico({ servico, onDone }: { servico?: Servico; onDone: () => void }) {
  const toast = useToast();
  const { state, pending, onSubmit } = useActionForm(async (prev: ActionState, formData: FormData) => {
    const result = await salvarServico(servico?.id ?? null, prev, formData);
    if (result.ok) {
      if (result.pontos) toast.pontos(result.pontos);
      else toast.sucesso("Serviço atualizado.");
      onDone();
    }
    return result;
  });
  const preco = servico?.price != null ? Number(servico.price).toFixed(2) : "";

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {state.error && <Alert>{state.error}</Alert>}
      <Field label="Nome" htmlFor="name" error={state.fieldErrors?.name}>
        <Input
          id="name"
          name="name"
          placeholder="Ex.: Pesquisa com Usuários"
          defaultValue={servico?.name}
          required
          autoFocus
        />
      </Field>
      <Field label="Preço" htmlFor="price" optional>
        <MoneyInput id="price" name="price" defaultValue={preco} />
      </Field>
      <Field
        label="Descrição"
        htmlFor="description"
        optional
        hint="Este texto será utilizado nas propostas e contratos, então capriche na explicação do que está incluso."
      >
        <Textarea id="description" name="description" defaultValue={servico?.description ?? ""} />
      </Field>
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <SubmitButton pending={pending} pendingText="Salvando…">
          {servico ? "Salvar alterações" : "Adicionar"}
        </SubmitButton>
      </DialogActions>
    </form>
  );
}

export function BotaoNovoServico({ label = "Adicionar serviço" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        {label}
      </Button>
      <ServicoDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
}
