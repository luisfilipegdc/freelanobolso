import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PassoCondicoes } from "./passo-condicoes";
import { PassoDadosGerais } from "./passo-dados-gerais";
import { PassoRevisao } from "./passo-revisao";
import { PassoServicos } from "./passo-servicos";
import { Stepper } from "@/components/freelanobolso/stepper";
import { exigirUsuario } from "@/lib/acoes";
import { PASSOS, podeEditar } from "@/lib/propostas";
import { carregarProposta } from "@/lib/propostas-server";

export const metadata: Metadata = { title: "Editar proposta" };

export default async function EditarPropostaPage({ params }: PageProps<"/propostas/[id]/editar/[passo]">) {
  const { id, passo } = await params;
  if (!PASSOS.some((p) => p.slug === passo)) notFound();

  const proposta = await carregarProposta(id);
  if (!podeEditar(proposta.status)) redirect(`/propostas/${id}`);

  const { supabase } = await exigirUsuario();
  const atual = PASSOS.find((p) => p.slug === passo)!;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/propostas" className="h5-destaque inline-flex w-fit items-center gap-2 hover:underline">
        <ArrowLeft className="size-4" />
        Voltar para Propostas
      </Link>
      <header className="border-b border-neutro-200 pb-5">
        <p className="texto-destaque">{proposta.title}</p>
        <h1 className="h1">{atual.label}</h1>
      </header>

      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Stepper passos={PASSOS} atual={passo} href={(slug) => `/propostas/${id}/editar/${slug}`} />
        </aside>

        <div className="min-w-0">
          {passo === "dados-gerais" && (
            <PassoDadosGerais
              proposta={proposta}
              pessoas={(await supabase.from("people").select("id, name").order("name")).data ?? []}
            />
          )}
          {passo === "servicos" && (
            <PassoServicos
              proposta={proposta}
              catalogo={
                (
                  await supabase
                    .from("services")
                    .select("id, name, description, price")
                    .eq("archived", false)
                    .order("name")
                ).data ?? []
              }
            />
          )}
          {passo === "condicoes" && <PassoCondicoes proposta={proposta} />}
          {passo === "revisao" && <PassoRevisao proposta={proposta} />}
        </div>
      </div>
    </div>
  );
}
