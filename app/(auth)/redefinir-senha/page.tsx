"use client";

import { useActionState } from "react";
import { redefinirSenha, type FormState } from "../actions";
import { AuthHeading } from "../auth-heading";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";

export default function RedefinirSenhaPage() {
  const [state, action] = useActionState<FormState, FormData>(redefinirSenha, {});

  return (
    <>
      <AuthHeading title="Criar nova senha" description="Escolha uma nova senha para acessar a sua conta." />
      <form action={action} className="flex flex-col gap-5">
        {state.error && <Alert>{state.error}</Alert>}
        <Field label="Nova senha" htmlFor="password" hint="Deve ter pelo menos 8 caracteres">
          <Input id="password" name="password" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <Field label="Confirme a nova senha" htmlFor="confirm">
          <Input id="confirm" name="confirm" type="password" autoComplete="new-password" minLength={8} required />
        </Field>
        <SubmitButton size="lg" className="w-full" pendingText="Salvando…">
          Salvar nova senha
        </SubmitButton>
      </form>
    </>
  );
}
