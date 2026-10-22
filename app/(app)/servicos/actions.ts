"use server";

import { revalidatePath } from "next/cache";
import { ERRO_GENERICO, exigirUsuario, opcional, texto, type ActionState } from "@/lib/acoes";
import { lerDinheiro } from "@/lib/mascaras";

const PONTOS_SERVICO = 5;

function lerServico(formData: FormData) {
  const dados = {
    name: texto(formData, "name"),
    price: lerDinheiro(texto(formData, "price")),
    description: opcional(formData, "description"),
  };
  const fieldErrors: Record<string, string> = {};
  if (!dados.name) fieldErrors.name = "Informe o nome do serviço.";
  if (dados.name.length > 120) fieldErrors.name = "Use até 120 caracteres.";
  return { dados, fieldErrors };
}

/** Cria (sem id) ou edita (com id) um serviço. Criar dá +5 pontos. */
export async function salvarServico(id: string | null, prev: ActionState, formData: FormData): Promise<ActionState> {
  const { dados, fieldErrors } = lerServico(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase, userId } = await exigirUsuario();
  const { error } = id
    ? await supabase.from("services").update(dados).eq("id", id)
    : await supabase.from("services").insert({ ...dados, owner_id: userId });
  if (error) return { error: ERRO_GENERICO };

  revalidatePath("/", "layout");
  return { ok: true, pontos: id ? undefined : PONTOS_SERVICO, vez: (prev.vez ?? 0) + 1 };
}

export async function excluirServico(id: string): Promise<ActionState> {
  const { supabase } = await exigirUsuario();
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) return { error: "Não conseguimos excluir agora. Tente novamente em instantes." };

  revalidatePath("/", "layout");
  return { ok: true };
}
