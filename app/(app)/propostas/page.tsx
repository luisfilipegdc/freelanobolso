import type { Metadata } from "next";
import Link from "next/link";
import { FileText } from "lucide-react";
import { CriarProposta } from "./criar-proposta";
import { PropostaMenu } from "./proposta-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/freelanobolso/empty-state";
import { LinkTabs } from "@/components/freelanobolso/link-tabs";
import { PageHeader } from "@/components/freelanobolso/page-header";
import { exigirUsuario } from "@/lib/acoes";
import { formatarData, formatarDinheiro } from "@/lib/mascaras";
import { contatoDe } from "@/lib/pessoas";
import { statusExibido, totais, type StatusProposta } from "@/lib/propostas";
import { STATUS_PROPOSTA } from "@/lib/status";

export const metadata: Metadata = { title: "Propostas" };

const ABAS = { todas: "Todas", rascunhos: "Rascunhos", aceitas: "Aceitas", rejeitadas: "Rejeitadas" } as const;
type Aba = keyof typeof ABAS;
const VAZIO: Record<Aba, string> = {
  todas: "",
  rascunhos: "Nenhum rascunho por aqui.",
  aceitas: "Nenhuma proposta aceita ainda. Logo, logo!",
  rejeitadas: "Nenhuma proposta rejeitada. Que beleza!",
};
const FILTRO: Record<Aba, StatusProposta | null> = {
  todas: null,
  rascunhos: "rascunho",
  aceitas: "aceita",
  rejeitadas: "rejeitada",
};

type Linha = {
  id: string;
  title: string;
  status: StatusProposta;
  expires_at: string | null;
  discount_pct: number | null;
  created_at: string;
  people: {
    name: string;
    type: "pf" | "pj";
    email: string | null;
    phone: string | null;
    rep_email: string | null;
    rep_phone: string | null;
  } | null;
  proposal_items: { quantity: number; unit_price: number }[];
};

export default async function PropostasPage({ searchParams }: PageProps<"/propostas">) {
  const params = await searchParams;
  const aba: Aba = typeof params.aba === "string" && params.aba in ABAS ? (params.aba as Aba) : "todas";

  const { supabase } = await exigirUsuario();
  const { count: total } = await supabase.from("proposals").select("id", { count: "exact", head: true });

  let query = supabase
    .from("proposals")
    .select(
      "id, title, status, expires_at, discount_pct, created_at, people(name, type, email, phone, rep_email, rep_phone), proposal_items(quantity, unit_price)",
    )
    .order("created_at", { ascending: false });
  if (FILTRO[aba]) query = query.eq("status", FILTRO[aba]);
  const { data } = await query;
  const propostas = (data ?? []) as unknown as Linha[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Propostas"
        description="Automatize a criação de propostas comerciais de alta conversão e acompanhe o status de cada uma."
        actions={total ? <CriarProposta /> : undefined}
      />

      {!total ? (
        <EmptyState
          icon={<FileText />}
          title="Você ainda não criou propostas"
          description="Em menos de 1 minuto e com apenas alguns cliques você monta uma proposta bonita, envia pelo WhatsApp e fica sabendo quando o cliente abrir."
          action={<CriarProposta label="Criar minha primeira proposta" />}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <LinkTabs
            active={aba}
            tabs={(Object.keys(ABAS) as Aba[]).map((a) => ({
              key: a,
              label: ABAS[a],
              href: a === "todas" ? "/propostas" : `/propostas?aba=${a}`,
            }))}
          />

          {propostas.length === 0 ? (
            <p className="texto rounded-xl border border-neutro-200 bg-branco px-6 py-10 text-center">{VAZIO[aba]}</p>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border border-neutro-200 bg-branco">
              <table className="w-full text-left">
                <thead className="border-b border-neutro-200 bg-neutro-50">
                  <tr>
                    <th className="h6 px-4 py-3 sm:px-6">Proposta</th>
                    <th className="h6 px-4 py-3 sm:px-6">Status</th>
                    <th className="h6 hidden px-6 py-3 md:table-cell">Valor</th>
                    <th className="h6 hidden px-6 py-3 lg:table-cell">Criada em</th>
                    <th className="px-4 py-3 sm:px-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutro-200">
                  {propostas.map((p) => {
                    const status = STATUS_PROPOSTA[statusExibido(p)];
                    const cliente = p.people ? { name: p.people.name, ...contatoDe(p.people) } : null;
                    return (
                      <tr key={p.id} className="hover:bg-neutro-25">
                        <td className="px-4 py-4 sm:px-6">
                          <Link href={`/propostas/${p.id}`} className="block">
                            <span className="h5 block">{p.title}</span>
                            <span className="texto-pequeno">{cliente?.name ?? "Sem cliente"}</span>
                          </Link>
                        </td>
                        <td className="px-4 py-4 sm:px-6">
                          <Badge variant={status.cor}>{status.label}</Badge>
                        </td>
                        <td className="texto hidden px-6 py-4 md:table-cell">
                          {formatarDinheiro(totais(p.proposal_items, p.discount_pct).total)}
                        </td>
                        <td className="texto hidden px-6 py-4 lg:table-cell">{formatarData(p.created_at)}</td>
                        <td className="w-px px-4 py-4 text-right sm:px-6">
                          <PropostaMenu id={p.id} title={p.title} cliente={cliente} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
