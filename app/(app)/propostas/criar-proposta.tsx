"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FilePlus, Plus } from "lucide-react";
import { criarProposta } from "./actions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";
import { useToast } from "@/components/freelanobolso/toast";
import { useActionForm } from "@/hooks/use-action-form";
import type { ActionState } from "@/lib/acoes";

/** Botão + modal "Criar proposta" (só o nome; o resto vem no wizard). +5 pontos. */
export function CriarProposta({ label = "Criar proposta" }: { label?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus />
        {label}
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        icon={<FilePlus />}
        title="Criar proposta"
        description="Dê um nome para a proposta. Você pode mudá-lo depois."
      >
        {open && <Form onCancel={() => setOpen(false)} />}
      </Dialog>
    </>
  );
}

function Form({ onCancel }: { onCancel: () => void }) {
  const router = useRouter();
  const toast = useToast();
  const { state, pending, onSubmit } = useActionForm(async (prev: ActionState, formData: FormData) => {
    const result = await criarProposta(prev, formData);
    if (result.ok && result.id) {
      toast.pontos(result.pontos ?? 0);
      router.push(`/propostas/${result.id}/editar/dados-gerais`);
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {state.error && <Alert>{state.error}</Alert>}
      <Field label="Nome da proposta" htmlFor="title" error={state.fieldErrors?.title}>
        <Input id="title" name="title" placeholder="Ex.: Site do Petshop Aumigo" required autoFocus />
      </Field>
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancelar
        </Button>
        <SubmitButton pending={pending || state.ok} pendingText="Criando…">
          Criar e continuar
        </SubmitButton>
      </DialogActions>
    </form>
  );
}
