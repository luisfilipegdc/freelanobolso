import { hojeISO } from "./datas";

export type StatusProposta = "rascunho" | "enviada" | "visualizada" | "aceita" | "rejeitada" | "expirada";
export type MeioPagamento = "pix" | "boleto" | "cartao";

export const MEIOS_PAGAMENTO: { value: MeioPagamento; label: string }[] = [
  { value: "pix", label: "PIX" },
  { value: "boleto", label: "Boleto" },
  { value: "cartao", label: "Cartão de Crédito" },
];

export type ItemProposta = {
  service_id?: string | null;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
};

/** O que é preciso para desenhar a proposta (no app, na revisão e no link público). */
export type PropostaDoc = {
  title: string;
  cover_url: string | null;
  objective: string | null;
  presentation: string | null;
  expires_at: string | null;
  discount_pct: number | null;
  deadline_days: number | null;
  deadline_business_days: boolean | null;
  payment_structure: "a_vista" | "parcelado" | null;
  installments_description: string | null;
  payment_methods: string[] | null;
  notes: string | null;
  status: StatusProposta;
  sent_at: string | null;
  created_at: string;
  cliente: { name: string } | null;
  freelancer: { name: string; company_name: string | null; avatar_url: string | null };
  items: ItemProposta[];
};

export function totais(items: Pick<ItemProposta, "quantity" | "unit_price">[], descontoPct: number | null) {
  const subtotal = items.reduce((acc, i) => acc + Number(i.quantity) * Number(i.unit_price), 0);
  const desconto = Math.round(subtotal * (Number(descontoPct) || 0)) / 100;
  return { subtotal, desconto, total: subtotal - desconto };
}

/** Vencida = tem validade, já passou e o cliente ainda não respondeu. */
export function vencida(p: { status: StatusProposta; expires_at: string | null }) {
  return (p.status === "enviada" || p.status === "visualizada") && Boolean(p.expires_at) && p.expires_at! < hojeISO();
}

/** Status para exibir: "expirada" é calculado a partir da validade. */
export function statusExibido(p: { status: StatusProposta; expires_at: string | null }): StatusProposta {
  return vencida(p) ? "expirada" : p.status;
}

/** Só dá para enviar com cliente e pelo menos um serviço. */
export function pendenciasParaEnvio(p: { person_id: string | null; itens: number }) {
  const faltando: string[] = [];
  if (!p.person_id) faltando.push("escolha o cliente em Dados Gerais");
  if (p.itens === 0) faltando.push("adicione pelo menos um serviço");
  return faltando;
}

export const podeEditar = (status: StatusProposta) => status !== "aceita" && status !== "rejeitada";

export const PASSOS = [
  { slug: "dados-gerais", label: "Dados Gerais", descricao: "Cliente, objetivo e apresentação" },
  { slug: "servicos", label: "Serviços", descricao: "O que será entregue e quanto custa" },
  { slug: "condicoes", label: "Condições", descricao: "Prazo e pagamento" },
  { slug: "revisao", label: "Revisão", descricao: "Confira antes de enviar" },
] as const;
export type Passo = (typeof PASSOS)[number]["slug"];

/** Slug legível + sufixo aleatório (docs/04-modelo-dados.md), ex.: "petshop-aumigo-k3x9p2m7qa". */
export function gerarSlug(titulo: string) {
  const base = titulo
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/, "");
  const bytes = crypto.getRandomValues(new Uint8Array(10));
  const sufixo = Array.from(bytes, (b) => "abcdefghijkmnpqrstuvwxyz23456789"[b % 32]).join("");
  return base ? `${base}-${sufixo}` : sufixo;
}

export function mensagemProposta(titulo: string, cliente: string | null, url: string) {
  const ola = cliente ? `Olá, ${cliente.split(" ")[0]}!` : "Olá!";
  return `${ola} Preparei a proposta "${titulo}" para você. Dá uma olhada: ${url}`;
}
