import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/** Resultado padrão das Server Actions usadas com useActionState. */
export type ActionState = {
  ok?: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  /** Pontos ganhos com a ação, para o toast "Parabéns, você ganhou X pontos!". */
  pontos?: number;
  /** Incrementa a cada sucesso, para o cliente reagir mesmo a dois sucessos seguidos. */
  vez?: number;
};

/** Cliente do Supabase + id do usuário. Toda Server Action reautentica aqui. */
export async function exigirUsuario() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/entrar");
  return { supabase, userId: data.user.id };
}

export function texto(formData: FormData, campo: string) {
  return String(formData.get(campo) ?? "").trim();
}

/** Texto opcional: string vazia vira null no banco. */
export function opcional(formData: FormData, campo: string) {
  return texto(formData, campo) || null;
}

export const ERRO_GENERICO = "Não conseguimos salvar agora. Tente novamente em instantes.";
