"use client";

import { useActionState } from "react";
import Link from "next/link";
import { esqueciSenha, type FormState } from "../actions";
import { AuthHeading } from "../auth-heading";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";

export default function EsqueciSenhaPage() {
  const [state, action] = useActionState<FormState, FormData>(esqueciSenha, {});

  return (
    <>
      <AuthHeading
        title="Esqueci a senha"
        description="Sem problemas! Informe o seu email e enviaremos um link para você criar uma nova senha."
      />
      {state.message ? (
        <Alert variant="sucesso">{state.message}</Alert>
      ) : (
        <form action={action} className="flex flex-col gap-5">
          {state.error && <Alert>{state.error}</Alert>}
          <Field label="Email" htmlFor="email">
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Insira seu email"
              defaultValue={state.values?.email}
              required
            />
          </Field>
          <SubmitButton size="lg" className="w-full" pendingText="Enviando…">
            Enviar link
          </SubmitButton>
        </form>
      )}
      <Link href="/entrar" className="h5-destaque mt-6 block text-center hover:underline">
        Voltar para Entrar
      </Link>
    </>
  );
}
