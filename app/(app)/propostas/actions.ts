"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ERRO_GENERICO, exigirUsuario, opcional, texto, type ActionState } from "@/lib/acoes";
import { hojeISO } from "@/lib/datas";
import { lerDinheiro } from "@/lib/mascaras";
import {
  gerarSlug,
  MEIOS_PAGAMENTO,
  pendenciasParaEnvio,
  podeEditar,
  type ItemProposta,
  type StatusProposta,
} from "@/lib/propostas";

const PONTOS_PROPOSTA = 5;
const CAPA_MAX_BYTES = 2 * 1024 * 1024;
const CAPA_TIPOS: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/gif": "gif" };
const ERRO_BLOQUEADA = "Esta proposta já foi respondida pelo cliente e não pode mais ser alterada.";

/** Garante que a proposta é do usuário e ainda pode ser editada. */
async function abrirParaEdicao(id: string) {
  const ctx = await exigirUsuario();
  const { data } = await ctx.supabase.from("proposals").select("status").eq("id", id).maybeSingle();
  if (!data) return { ...ctx, erro: "Proposta não encontrada." };
  if (!podeEditar(data.status as StatusProposta)) return { ...ctx, erro: ERRO_BLOQUEADA };
  return { ...ctx, erro: null };
}

export async function criarProposta(prev: ActionState, formData: FormData): Promise<ActionState> {
  const title = texto(formData, "title");
  if (!title) return { fieldErrors: { title: "Dê um nome para a proposta." } };

  const { supabase, userId } = await exigirUsuario();
  const { data: perfil } = await supabase.from("profiles").select("presentation").eq("id", userId).single();
  const { data, error } = await supabase
    .from("proposals")
    .insert({ owner_id: userId, title, presentation: perfil?.presentation ?? null })
    .select("id")
    .single();
  if (error || !data) return { error: ERRO_GENERICO };

  revalidatePath("/", "layout");
  return { ok: true, id: data.id, pontos: PONTOS_PROPOSTA, vez: (prev.vez ?? 0) + 1 };
}

export async function salvarDadosGerais(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, userId, erro } = await abrirParaEdicao(id);
  if (erro) return { error: erro };

  const title = texto(formData, "title");
  const personId = opcional(formData, "person_id");
  const temVencimento = formData.get("tem_vencimento") === "on";
  const expiresAt = temVencimento ? opcional(formData, "expires_at") : null;
  const capa = formData.get("cover");
  const temCapa = capa instanceof File && capa.size > 0;

  const fieldErrors: Record<string, string> = {};
  if (!title) fieldErrors.title = "Dê um nome para a proposta.";
  if (temVencimento && !expiresAt) fieldErrors.expires_at = "Escolha a data de vencimento.";
  if (expiresAt && expiresAt < hojeISO()) fieldErrors.expires_at = "A data de vencimento já passou.";
  if (temCapa && !CAPA_TIPOS[capa.type]) fieldErrors.cover = "Envie uma imagem PNG, JPG ou GIF.";
  if (temCapa && capa.size > CAPA_MAX_BYTES) fieldErrors.cover = "A imagem deve ter no máximo 2 MB.";

  // A FK não passa pelo RLS: confirmamos que o cliente é mesmo do usuário.
  if (personId) {
    const { data } = await supabase.from("people").select("id").eq("id", personId).maybeSingle();
    if (!data) fieldErrors.person_id = "Escolha um cliente da sua lista de pessoas.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  let cover_url: string | null | undefined;
  if (formData.get("remover_capa") === "on") cover_url = null;
  if (temCapa) {
    const caminho = `${userId}/capas/${id}-${Date.now()}.${CAPA_TIPOS[capa.type]}`;
    const { error } = await supabase.storage.from("fotos").upload(caminho, capa, { contentType: capa.type });
    if (error) return { fieldErrors: { cover: "Não conseguimos enviar a imagem. Tente novamente." } };
    cover_url = supabase.storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
  }

  const { error } = await supabase
    .from("proposals")
    .update({
      title,
      person_id: personId,
      objective: opcional(formData, "objective"),
      presentation: opcional(formData, "presentation"),
      expires_at: expiresAt,
      ...(cover_url !== undefined && { cover_url }),
    })
    .eq("id", id);
  if (error) return { error: ERRO_GENERICO };

  revalidatePath("/propostas");
  redirect(`/propostas/${id}/editar/servicos`);
}

type ItemForm = { service_id: string | null; name: string; description: string; quantity: string; unit_price: string };

export async function salvarServicos(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, erro } = await abrirParaEdicao(id);
  if (erro) return { error: erro };

  let brutos: ItemForm[];
  try {
    brutos = JSON.parse(String(formData.get("items") ?? "[]"));
    if (!Array.isArray(brutos)) throw new Error();
  } catch {
    return { error: ERRO_GENERICO };
  }

  const items: ItemProposta[] = brutos.slice(0, 100).map((i) => ({
    service_id: i.service_id || null,
    name: String(i.name ?? "").trim(),
    description: String(i.description ?? "").trim() || null,
    quantity: Math.max(1, Math.min(9999, Math.floor(Number(i.quantity) || 1))),
    unit_price: lerDinheiro(String(i.unit_price ?? "")) ?? 0,
  }));
  const desconto = Number(texto(formData, "discount_pct").replace(",", ".")) || 0;

  if (items.some((i) => !i.name)) return { error: "Todo serviço precisa de um nome." };
  if (desconto < 0 || desconto > 100) return { fieldErrors: { discount_pct: "O desconto vai de 0% a 100%." } };

  // service_id só é mantido se o serviço for do usuário (a FK não passa pelo RLS).
  const ids = [...new Set(items.map((i) => i.service_id).filter(Boolean))] as string[];
  if (ids.length) {
    const { data } = await supabase.from("services").select("id").in("id", ids);
    const meus = new Set((data ?? []).map((s) => s.id));
    items.forEach((i) => i.service_id && !meus.has(i.service_id) && (i.service_id = null));
  }

  const { error: e1 } = await supabase.from("proposal_items").delete().eq("proposal_id", id);
  const { error: e2 } = items.length
    ? await supabase.from("proposal_items").insert(items.map((i, position) => ({ ...i, proposal_id: id, position })))
    : { error: null };
  const { error: e3 } = await supabase.from("proposals").update({ discount_pct: desconto }).eq("id", id);
  if (e1 || e2 || e3) return { error: ERRO_GENERICO };

  revalidatePath("/propostas");
  redirect(`/propostas/${id}/editar/condicoes`);
}

export async function salvarCondicoes(id: string, _prev: ActionState, formData: FormData): Promise<ActionState> {
  const { supabase, erro } = await abrirParaEdicao(id);
  if (erro) return { error: erro };

  const dias = texto(formData, "deadline_days");
  const deadline_days = dias ? Math.floor(Number(dias)) : null;
  const parcelado = texto(formData, "payment_structure") === "parcelado";
  const meios = formData.getAll("payment_methods").map(String);

  const fieldErrors: Record<string, string> = {};
  if (deadline_days !== null && (!Number.isFinite(deadline_days) || deadline_days < 1 || deadline_days > 3650)) {
    fieldErrors.deadline_days = "Informe um prazo entre 1 e 3650 dias.";
  }
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { error } = await supabase
    .from("proposals")
    .update({
      deadline_days,
      deadline_business_days: texto(formData, "deadline_type") === "uteis",
      payment_structure: parcelado ? "parcelado" : "a_vista",
      installments_description: parcelado ? opcional(formData, "installments_description") : null,
      payment_methods: MEIOS_PAGAMENTO.map((m) => m.value).filter((m) => meios.includes(m)),
      notes: opcional(formData, "notes"),
    })
    .eq("id", id);
  if (error) return { error: ERRO_GENERICO };

  revalidatePath("/propostas");
  redirect(`/propostas/${id}/editar/revisao`);
}

/** Gera o link público (se ainda não existir). Não muda o status: isso só acontece ao enviar. */
export async function prepararEnvio(id: string): Promise<ActionState> {
  const { supabase } = await exigirUsuario();
  const { data: p } = await supabase
    .from("proposals")
    .select("title, status, person_id, public_slug, proposal_items(count)")
    .eq("id", id)
    .maybeSingle();
  if (!p) return { error: "Proposta não encontrada." };

  const itens = (p.proposal_items as unknown as { count: number }[])[0]?.count ?? 0;
  const faltando = pendenciasParaEnvio({ person_id: p.person_id, itens });
  if (faltando.length) return { error: `Antes de enviar, ${faltando.join(" e ")}.` };
  if (p.public_slug) return { ok: true, slug: p.public_slug };

  const slug = gerarSlug(p.title);
  const { error } = await supabase.from("proposals").update({ public_slug: slug }).eq("id", id);
  if (error) return { error: ERRO_GENERICO };
  return { ok: true, slug };
}

/** "Ao copiar o link, a proposta será considerada como Enviada." */
export async function marcarEnviada(id: string): Promise<ActionState> {
  const { supabase } = await exigirUsuario();
  const { error } = await supabase
    .from("proposals")
    .update({ status: "enviada", sent_at: new Date().toISOString() })
    .eq("id", id)
    .eq("status", "rascunho")
    .not("public_slug", "is", null);
  if (error) return { error: ERRO_GENERICO };

  revalidatePath("/propostas", "layout");
  return { ok: true };
}

export async function excluirProposta(id: string): Promise<ActionState> {
  const { supabase } = await exigirUsuario();
  const { error } = await supabase.from("proposals").delete().eq("id", id);
  if (error) return { error: "Não conseguimos excluir agora. Tente novamente em instantes." };

  revalidatePath("/", "layout");
  return { ok: true };
}
