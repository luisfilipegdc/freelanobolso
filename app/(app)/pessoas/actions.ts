"use server";

import { revalidatePath } from "next/cache";
import { ERRO_GENERICO, exigirUsuario, opcional, texto, type ActionState } from "@/lib/acoes";
import { cnpjValido, cpfValido, mascaraCep, mascaraCnpj, mascaraCpf, mascaraTelefone, UFS } from "@/lib/mascaras";

const PONTOS_PESSOA = 2;
const FOTO_MAX_BYTES = 2 * 1024 * 1024;
const FOTO_TIPOS: Record<string, string> = {
  "image/svg+xml": "svg",
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
};

function emailValido(email: string | null) {
  return !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const telefone = (formData: FormData, campo: string) => {
  const v = mascaraTelefone(texto(formData, campo));
  return v || null;
};

/** Campos de "Dados Básicos", comuns ao modal Adicionar pessoa e à aba Dados. */
function lerDadosBasicos(formData: FormData) {
  const type = texto(formData, "type") === "pj" ? "pj" : "pf";
  const dados = {
    type,
    name: texto(formData, "name"),
    email: type === "pf" ? opcional(formData, "email") : null,
    phone: type === "pf" ? telefone(formData, "phone") : null,
    rep_name: type === "pj" ? opcional(formData, "rep_name") : null,
    rep_email: type === "pj" ? opcional(formData, "rep_email") : null,
    rep_phone: type === "pj" ? telefone(formData, "rep_phone") : null,
  } as const;

  const fieldErrors: Record<string, string> = {};
  if (!dados.name) fieldErrors.name = type === "pf" ? "Informe o nome." : "Informe o nome da empresa.";
  if (!emailValido(dados.email)) fieldErrors.email = "Este email não parece válido.";
  if (!emailValido(dados.rep_email)) fieldErrors.rep_email = "Este email não parece válido.";
  return { dados, fieldErrors };
}

export async function criarPessoa(prev: ActionState, formData: FormData): Promise<ActionState> {
  const { dados, fieldErrors } = lerDadosBasicos(formData);
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase, userId } = await exigirUsuario();
  const { error } = await supabase.from("people").insert({ ...dados, owner_id: userId });
  if (error) return { error: ERRO_GENERICO };

  revalidatePath("/", "layout");
  return { ok: true, pontos: PONTOS_PESSOA, vez: (prev.vez ?? 0) + 1 };
}

export async function salvarDadosBasicos(id: string, prev: ActionState, formData: FormData): Promise<ActionState> {
  const { dados, fieldErrors } = lerDadosBasicos(formData);
  const foto = formData.get("photo");
  const temFoto = foto instanceof File && foto.size > 0;
  if (temFoto && !FOTO_TIPOS[foto.type]) fieldErrors.photo = "Envie uma imagem SVG, PNG, JPG ou GIF.";
  if (temFoto && foto.size > FOTO_MAX_BYTES) fieldErrors.photo = "A imagem deve ter no máximo 2 MB.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase, userId } = await exigirUsuario();
  let photo_url: string | undefined;

  if (temFoto) {
    const caminho = `${userId}/pessoas/${id}-${Date.now()}.${FOTO_TIPOS[foto.type]}`;
    const { error } = await supabase.storage.from("fotos").upload(caminho, foto, { contentType: foto.type });
    if (error) return { fieldErrors: { photo: "Não conseguimos enviar a foto. Tente novamente." } };
    photo_url = supabase.storage.from("fotos").getPublicUrl(caminho).data.publicUrl;
  }

  const { error } = await supabase
    .from("people")
    .update({ ...dados, ...(photo_url && { photo_url }) })
    .eq("id", id);
  if (error) return { error: ERRO_GENERICO };

  revalidatePath(`/pessoas/${id}`);
  return { ok: true, vez: (prev.vez ?? 0) + 1 };
}

export async function salvarDadosDocumentos(id: string, prev: ActionState, formData: FormData): Promise<ActionState> {
  const type = texto(formData, "type") === "pj" ? "pj" : "pf";
  const uf = texto(formData, "state").toUpperCase();
  const dados = {
    cpf: type === "pf" ? mascaraCpf(texto(formData, "cpf")) || null : null,
    legal_name: type === "pj" ? opcional(formData, "legal_name") : null,
    cnpj: type === "pj" ? mascaraCnpj(texto(formData, "cnpj")) || null : null,
    rep_cpf: type === "pj" ? mascaraCpf(texto(formData, "rep_cpf")) || null : null,
    cep: mascaraCep(texto(formData, "cep")) || null,
    address: opcional(formData, "address"),
    address_number: opcional(formData, "address_number"),
    complement: opcional(formData, "complement"),
    city: opcional(formData, "city"),
    state: (UFS as readonly string[]).includes(uf) ? uf : null,
  };

  const fieldErrors: Record<string, string> = {};
  if (dados.cpf && !cpfValido(dados.cpf)) fieldErrors.cpf = "CPF inválido.";
  if (dados.rep_cpf && !cpfValido(dados.rep_cpf)) fieldErrors.rep_cpf = "CPF inválido.";
  if (dados.cnpj && !cnpjValido(dados.cnpj)) fieldErrors.cnpj = "CNPJ inválido.";
  if (dados.cep && dados.cep.length !== 9) fieldErrors.cep = "CEP incompleto.";
  if (Object.keys(fieldErrors).length) return { fieldErrors };

  const { supabase } = await exigirUsuario();
  const { error } = await supabase.from("people").update(dados).eq("id", id);
  if (error) return { error: ERRO_GENERICO };

  revalidatePath(`/pessoas/${id}`);
  return { ok: true, vez: (prev.vez ?? 0) + 1 };
}

export async function excluirPessoa(id: string): Promise<ActionState> {
  const { supabase } = await exigirUsuario();
  const { error } = await supabase.from("people").delete().eq("id", id);
  if (error) return { error: "Não conseguimos excluir agora. Tente novamente em instantes." };

  revalidatePath("/", "layout");
  return { ok: true };
}
