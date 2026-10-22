import type { Metadata } from "next";
import Link from "next/link";
import { Users } from "lucide-react";
import { AdicionarPessoa } from "./adicionar-pessoa";
import { PessoaMenu } from "./pessoa-menu";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/freelanobolso/empty-state";
import { LinkTabs } from "@/components/freelanobolso/link-tabs";
import { PageHeader } from "@/components/freelanobolso/page-header";
import { PersonAvatar } from "@/components/freelanobolso/person-avatar";
import { SearchInput } from "@/components/freelanobolso/search-input";
import { exigirUsuario } from "@/lib/acoes";
import { contatoDe, type Pessoa } from "@/lib/pessoas";

export const metadata: Metadata = { title: "Pessoas" };

const ABAS = { todos: "Todos", clientes: "Clientes", leads: "Leads" } as const;
type Aba = keyof typeof ABAS;

/** Remove o que quebraria o filtro do PostgREST ou viraria curinga. */
const limparBusca = (q: string) =>
  q
    .replace(/[%_,()"\\]/g, " ")
    .trim()
    .slice(0, 80);

export default async function PessoasPage({ searchParams }: PageProps<"/pessoas">) {
  const params = await searchParams;
  const aba: Aba = typeof params.aba === "string" && params.aba in ABAS ? (params.aba as Aba) : "todos";
  const q = typeof params.q === "string" ? limparBusca(params.q) : "";

  const { supabase } = await exigirUsuario();
  const { count: total } = await supabase.from("people").select("id", { count: "exact", head: true });

  let query = supabase
    .from("people")
    .select("id, type, name, email, phone, rep_name, rep_email, rep_phone, photo_url, is_client")
    .order("created_at", { ascending: false });
  if (aba === "clientes") query = query.eq("is_client", true);
  if (aba === "leads") query = query.eq("is_client", false);
  if (q) query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,rep_name.ilike.%${q}%,rep_email.ilike.%${q}%`);
  const { data } = await query;
  const pessoas = (data ?? []) as Pessoa[];

  const href = (a: Aba) => `/pessoas?${new URLSearchParams({ ...(a !== "todos" && { aba: a }), ...(q && { q }) })}`;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Pessoas"
        description="Cadastre as pessoas que têm relação com o seu negócio, tanto clientes como leads, e acompanhe seu histórico com cada um."
        actions={total ? <AdicionarPessoa /> : undefined}
      />

      {!total ? (
        <EmptyState
          icon={<Users />}
          title="Você ainda não tem pessoas cadastradas"
          description="Que mundo de oportunidades! Com apenas um nome você já pode começar a organizar seus clientes e leads."
          action={<AdicionarPessoa label="Adicionar a primeira pessoa" />}
        />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <LinkTabs
              active={aba}
              tabs={(Object.keys(ABAS) as Aba[]).map((a) => ({ key: a, label: ABAS[a], href: href(a) }))}
            />
            <SearchInput
              placeholder="Busque uma pessoa"
              defaultValue={q}
              hidden={{ aba: aba === "todos" ? undefined : aba }}
            />
          </div>

          {pessoas.length === 0 ? (
            <p className="texto rounded-xl border border-neutro-200 bg-branco px-6 py-10 text-center">
              {q
                ? `Nenhuma pessoa encontrada para "${q}".`
                : aba === "clientes"
                  ? "Nenhum cliente ainda. Um lead vira cliente quando recebe um projeto."
                  : "Nenhum lead por aqui."}
            </p>
          ) : (
            <div className="relative overflow-x-auto rounded-xl border border-neutro-200 bg-branco">
              <table className="w-full text-left">
                <thead className="border-b border-neutro-200 bg-neutro-50">
                  <tr>
                    <th className="h6 px-4 py-3 sm:px-6">Pessoa</th>
                    <th className="h6 hidden px-6 py-3 sm:table-cell">Contato</th>
                    <th className="px-4 py-3 sm:px-6">
                      <span className="sr-only">Ações</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutro-200">
                  {pessoas.map((p) => {
                    const contato = contatoDe(p);
                    return (
                      <tr key={p.id} className="hover:bg-neutro-25">
                        <td className="px-4 py-4 sm:px-6">
                          <Link href={`/pessoas/${p.id}`} className="flex items-center gap-3">
                            <PersonAvatar name={p.name} src={p.photo_url} />
                            <span className="min-w-0">
                              <span className="flex items-center gap-2">
                                <span className="h5 truncate">{p.name}</span>
                                <Badge variant={p.is_client ? "sucesso" : "primaria"}>
                                  {p.is_client ? "Cliente" : "Lead"}
                                </Badge>
                              </span>
                              {p.type === "pj" && p.rep_name && (
                                <span className="texto-pequeno block">{p.rep_name}</span>
                              )}
                            </span>
                          </Link>
                        </td>
                        <td className="texto hidden px-6 py-4 sm:table-cell">
                          <span className="block">{contato.email ?? "—"}</span>
                          {contato.phone && <span className="block">{contato.phone}</span>}
                        </td>
                        <td className="w-px px-4 py-4 text-right sm:px-6">
                          <PessoaMenu id={p.id} name={p.name} email={contato.email} phone={contato.phone} />
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
