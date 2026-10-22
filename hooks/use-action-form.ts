"use client";

import { startTransition, useActionState, type FormEvent } from "react";
import type { ActionState } from "@/lib/acoes";

/**
 * useActionState enviado por onSubmit. Diferente de <form action>, não limpa os campos
 * depois do envio — assim um erro de validação não apaga o que a pessoa digitou.
 */
export function useActionForm(acao: (prev: ActionState, formData: FormData) => Promise<ActionState>) {
  const [state, dispatch, pending] = useActionState(acao, {});

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => dispatch(formData));
  };

  return { state, pending, onSubmit };
}
