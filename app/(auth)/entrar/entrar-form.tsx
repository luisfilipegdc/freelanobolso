"use client";

import { useActionState } from "react";
import Link from "next/link";
import { entrar, type FormState } from "../actions";
import { GoogleButton } from "../google-button";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";

export function EntrarForm({ erroInicial }: { erroInicial?: string }) {
  const [state, action] = useActionState<FormState, FormData>(entrar, { error: erroInicial });

  return (
    <div className="flex flex-col gap-6">
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

        <Field label="Senha" htmlFor="password">
          <Input id="password" name="password" type="password" autoComplete="current-password" required />
        </Field>

        <div className="flex items-center justify-between gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-neutro-700">
            <Checkbox name="lembrar" defaultChecked />
            Permanecer conectado
          </label>
          <Link href="/esqueci-a-senha" className="h5-destaque hover:underline">
            Esqueci a senha
          </Link>
        </div>

        <SubmitButton size="lg" className="w-full" pendingText="Entrando…">
          Entrar
        </SubmitButton>
      </form>

      <GoogleButton />

      <p className="texto text-center">
        Ainda não é cadastrado?{" "}
        <Link href="/criar-conta" className="h5-destaque hover:underline">
          Crie uma conta
        </Link>
      </p>
    </div>
  );
}
