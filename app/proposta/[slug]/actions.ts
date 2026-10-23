"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Chamado pelo navegador do cliente (robôs de pré-visualização de link não contam). */
export async function registrarVisualizacao(slug: string) {
  const supabase = await createClient();
  await supabase.rpc("registrar_visualizacao_proposta", { p_slug: slug });
}

export async function responderProposta(slug: string, aceitar: boolean) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("responder_proposta", { p_slug: slug, p_aceitar: aceitar });
  revalidatePath(`/proposta/${slug}`);
  if (error || !data) return { error: "Não foi possível registrar sua resposta. Atualize a página e tente de novo." };
  return { ok: true };
}
