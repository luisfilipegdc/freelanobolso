export type TipoPessoa = "pf" | "pj";

export type Pessoa = {
  id: string;
  type: TipoPessoa;
  name: string;
  email: string | null;
  phone: string | null;
  photo_url: string | null;
  rep_name: string | null;
  rep_email: string | null;
  rep_phone: string | null;
  rep_cpf: string | null;
  cpf: string | null;
  legal_name: string | null;
  cnpj: string | null;
  cep: string | null;
  address: string | null;
  address_number: string | null;
  complement: string | null;
  city: string | null;
  state: string | null;
  is_client: boolean;
  created_at: string;
};

/** Contato principal: na PJ, o do representante. */
export function contatoDe(p: Pick<Pessoa, "type" | "email" | "phone" | "rep_email" | "rep_phone">) {
  return p.type === "pj"
    ? { email: p.rep_email ?? p.email, phone: p.rep_phone ?? p.phone }
    : { email: p.email, phone: p.phone };
}

/** Link do WhatsApp a partir do telefone mascarado (assume Brasil, +55). */
export function linkWhatsApp(phone: string | null) {
  const d = (phone ?? "").replace(/\D/g, "");
  if (d.length < 10) return null;
  return `https://wa.me/55${d}`;
}
