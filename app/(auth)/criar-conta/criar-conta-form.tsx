"use client";

import { useActionState } from "react";
import Link from "next/link";
import { criarConta, type FormState } from "../actions";
import { GoogleButton } from "../google-button";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/freelanobolso/submit-button";

export function CriarContaForm() {
  const [state, action] = useActionState<FormState, FormData>(criarConta, {});

  if (state.message) {
    return (
      <div className="flex flex-col gap-6">
        <Alert variant="sucesso">{state.message}</Alert>
        <Link href="/entrar" className="h5-destaque text-center hover:underline">
          Voltar para Entrar
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <form action={action} className="flex flex-col gap-5">
        {state.error && <Alert>{state.error}</Alert>}

        <Field label="Nome" htmlFor="name">
          <Input
            id="name"
            name="name"
            autoComplete="name"
            placeholder="Ex.: Tiago Costa"
            defaultValue={state.values?.name}
            required
          />
        </Field>

        <Field label="Nome da sua Empresa" htmlFor="company_name" optional>
          <Input
            id="company_name"
            name="company_name"
            autoComplete="organization"
            placeholder="Ex.: Costa Design"
            defaultValue={state.values?.company_name}
          />
        </Field>

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

        <Field label="Senha" htmlFor="password" hint="Deve ter pelo menos 8 caracteres">
          <Input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Crie uma senha"
            minLength={8}
            required
          />
        </Field>

        <SubmitButton size="lg" className="w-full" pendingText="Criando sua conta…">
          Criar conta
        </SubmitButton>

        <p className="texto-pequeno text-center">
          Ao clicar em &quot;Criar conta&quot;, você concorda com os Termos de Uso e Política de Privacidade.
        </p>
      </form>

      <GoogleButton />

      <p className="texto text-center">
        Já tem uma conta?{" "}
        <Link href="/entrar" className="h5-destaque hover:underline">
          Entrar
        </Link>
      </p>
    </div>
  );
}
