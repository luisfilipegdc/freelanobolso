import "server-only";
import { notFound } from "next/navigation";
import { exigirUsuario } from "./acoes";
import type { ItemProposta, PropostaDoc, StatusProposta } from "./propostas";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type PropostaCompleta = PropostaDoc & {
  id: string;
  person_id: string | null;
  public_slug: string | null;
  viewed_at: string | null;
  answered_at: string | null;
  items: (ItemProposta & { id: string })[];
  cliente: { name: string; email: string | null; phone: string | null } | null;
};

/** Proposta do usuário logado com itens, cliente e perfil. 404 se não existir (ou for de outra pessoa). */
export async function carregarProposta(id: string): Promise<PropostaCompleta> {
  if (!UUID.test(id)) notFound();
  const { supabase, userId } = await exigirUsuario();

  const [{ data: p }, { data: perfil }] = await Promise.all([
    supabase
      .from("proposals")
      .select(
        "*, proposal_items(id, service_id, name, description, quantity, unit_price, position), people(name, type, email, phone, rep_email, rep_phone)",
      )
      .eq("id", id)
      .maybeSingle(),
    supabase.from("profiles").select("name, company_name, avatar_url").eq("id", userId).single(),
  ]);
  if (!p) notFound();

  const pessoa = p.people as {
    name: string;
    type: string;
    email: string | null;
    phone: string | null;
    rep_email: string | null;
    rep_phone: string | null;
  } | null;
  const items = ((p.proposal_items ?? []) as (ItemProposta & { id: string; position: number })[]).sort(
    (a, b) => a.position - b.position,
  );

  return {
    ...p,
    status: p.status as StatusProposta,
    items,
    cliente: pessoa && {
      name: pessoa.name,
      email: pessoa.type === "pj" ? (pessoa.rep_email ?? pessoa.email) : pessoa.email,
      phone: pessoa.type === "pj" ? (pessoa.rep_phone ?? pessoa.phone) : pessoa.phone,
    },
    freelancer: perfil ?? { name: "", company_name: null, avatar_url: null },
  };
}
