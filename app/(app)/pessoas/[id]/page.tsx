import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AbaDados } from "./aba-dados";
import { AbaDocumentos, AbaPagamentos, AbaProjetos } from "./abas-historico";
import { AcoesPessoa } from "./acoes-pessoa";
import { Badge } from "@/components/ui/badge";
import { LinkTabs } from "@/components/freelanobolso/link-tabs";
import { PersonAvatar } from "@/components/freelanobolso/person-avatar";
import { exigirUsuario } from "@/lib/acoes";
import { formatarData } from "@/lib/mascaras";
import type { Pessoa } from "@/lib/pessoas";

export const metadata: Metadata = { title: "Detalhes da pessoa" };

const ABAS = { dados: "Dados", projetos: "Projetos", pagamentos: "Pagamentos", documentos: "Documentos" } as const;
type Aba = keyof typeof ABAS;

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function PessoaPage({ params, searchParams }: PageProps<"/pessoas/[id]">) {
  const { id } = await params;
  const sp = await searchParams;
  const aba: Aba = typeof sp.aba === "string" && sp.aba in ABAS ? (sp.aba as Aba) : "dados";
  if (!UUID.test(id)) notFound();

  const { supabase } = await exigirUsuario();
  const { data } = await supabase.from("people").select("*").eq("id", id).maybeSingle();
  if (!data) notFound();
  const pessoa = data as Pessoa;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/pessoas" className="h5-destaque inline-flex w-fit items-center gap-2 hover:underline">
        <ArrowLeft className="size-4" />
        Voltar para Pessoas
      </Link>

      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <PersonAvatar name={pessoa.name} src={pessoa.photo_url} className="size-16 text-lg" />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="h1 truncate">{pessoa.name}</h1>
              <Badge variant={pessoa.is_client ? "sucesso" : "primaria"}>{pessoa.is_client ? "Cliente" : "Lead"}</Badge>
            </div>
            <p className="texto">
              {pessoa.is_client ? "Cliente" : "Lead"} adicionado em {formatarData(pessoa.created_at)}
            </p>
          </div>
        </div>
        <AcoesPessoa id={pessoa.id} name={pessoa.name} />
      </header>

      <LinkTabs
        active={aba}
        tabs={(Object.keys(ABAS) as Aba[]).map((a) => ({
          key: a,
          label: ABAS[a],
          href: a === "dados" ? `/pessoas/${id}` : `/pessoas/${id}?aba=${a}`,
        }))}
      />

      {aba === "dados" && <AbaDados pessoa={pessoa} />}
      {aba === "projetos" && <AbaProjetos pessoaId={pessoa.id} />}
      {aba === "pagamentos" && <AbaPagamentos pessoaId={pessoa.id} />}
      {aba === "documentos" && <AbaDocumentos pessoaId={pessoa.id} />}
    </div>
  );
}
