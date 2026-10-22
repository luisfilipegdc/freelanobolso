"use client";

import { useState } from "react";
import { Plus, UserPlus } from "lucide-react";
import { criarPessoa } from "./actions";
import { CamposBasicos, OPCOES_TIPO } from "./campos-basicos";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { RadioCards } from "@/components/ui/radio-cards";
import { SubmitButton } from "@/components/freelanobolso/submit-button";
import { useToast } from "@/components/freelanobolso/toast";
import { useActionForm } from "@/hooks/use-action-form";
import type { ActionState } from "@/lib/acoes";
import type { TipoPessoa } from "@/lib/pessoas";

/** Botão + modal "Adicionar pessoa" (+2 pontos). */
export function AdicionarPessoa({ label = "Adicionar pessoa" }: { label?: string }) {
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
        icon={<UserPlus />}
        title="Adicionar pessoa"
        description="Toda pessoa será adicionada como um lead. Quando você criar um projeto e atribuir ao lead, ele se tornará um cliente."
      >
        {open && <FormPessoa onDone={() => setOpen(false)} />}
      </Dialog>
    </>
  );
}

function FormPessoa({ onDone }: { onDone: () => void }) {
  const toast = useToast();
  const [tipo, setTipo] = useState<TipoPessoa>("pf");
  const { state, pending, onSubmit } = useActionForm(async (prev: ActionState, formData: FormData) => {
    const result = await criarPessoa(prev, formData);
    if (result.ok) {
      toast.pontos(result.pontos ?? 0);
      onDone();
    }
    return result;
  });

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {state.error && <Alert>{state.error}</Alert>}
      <RadioCards name="type" options={OPCOES_TIPO} value={tipo} onChange={setTipo} />
      <CamposBasicos key={tipo} tipo={tipo} erros={state.fieldErrors} />
      <DialogActions>
        <Button type="button" variant="secondary" onClick={onDone}>
          Cancelar
        </Button>
        <SubmitButton pending={pending} pendingText="Adicionando…">
          Adicionar
        </SubmitButton>
      </DialogActions>
    </form>
  );
}
