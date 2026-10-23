import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { AcoesProposta } from "./acoes-proposta";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PropostaDocumento } from "@/components/freelanobolso/proposta-documento";
import { formatarData } from "@/lib/mascaras";
import { podeEditar, statusExibido } from "@/lib/propostas";
import { carregarProposta } from "@/lib/propostas-server";
import { STATUS_PROPOSTA } from "@/lib/status";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Detalhes da proposta" };

function Marco({ feito, titulo, quando }: { feito: boolean; titulo: string; quando?: string | null }) {
  return (
    <li className="flex items-start gap-3">
      <span
        className={cn(
          "mt-1 size-3 shrink-0 rounded-full border-2",
          feito ? "border-primaria-600 bg-primaria-600" : "border-neutro-300 bg-branco",
        )}
      />
      <span>
        <span className={cn("block text-sm font-semibold", feito ? "text-neutro-900" : "text-neutro-500")}>
          {titulo}
        </span>
        <span className="texto-pequeno">{quando ? formatarData(quando) : "—"}</span>
      </span>
    </li>
  );
}

export default async function PropostaPage({ params, searchParams }: PageProps<"/propostas/[id]">) {
  const { id } = await params;
  const { enviar } = await searchParams;
  const p = await carregarProposta(id);
  const status = STATUS_PROPOSTA[statusExibido(p)];

  return (
    <div className="flex flex-col gap-6">
      <Link href="/propostas" className="h5-destaque inline-flex w-fit items-center gap-2 hover:underline">
        <ArrowLeft className="size-4" />
        Voltar para Propostas
      </Link>

      <header className="flex flex-col gap-4 border-b border-neutro-200 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="h1 break-words">{p.title}</h1>
            <Badge variant={status.cor}>{status.label}</Badge>
          </div>
          <p className="texto-grande">{p.cliente?.name ?? "Sem cliente"}</p>
        </div>
        <AcoesProposta
          id={p.id}
          title={p.title}
          slug={p.public_slug}
          cliente={p.cliente}
          rascunho={p.status === "rascunho"}
          editavel={podeEditar(p.status)}
          abrirEnvio={enviar === "1"}
        />
      </header>

      {p.status === "aceita" && (
        <div className="flex flex-col gap-4 rounded-xl border border-sucesso-300 bg-sucesso-25 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="size-6 shrink-0 text-sucesso-600" />
            <div>
              <p className="h5">A proposta {p.title} foi aceita!</p>
              <p className="texto">Hora de formalizar. Contratos e projetos chegam nas próximas fases.</p>
            </div>
          </div>
          <div className="flex shrink-0 flex-wrap gap-3">
            <Button variant="secondary" disabled title="Disponível na Fase 4">
              Transformar em contrato
            </Button>
            <Button variant="secondary" disabled title="Disponível na Fase 5">
              Transformar em projeto
            </Button>
          </div>
        </div>
      )}
      {p.status === "rejeitada" && (
        <div className="flex items-start gap-3 rounded-xl border border-erro-300 bg-erro-25 p-5">
          <XCircle className="size-6 shrink-0 text-erro-600" />
          <div>
            <p className="h5">O cliente recusou esta proposta.</p>
            <p className="texto">Que tal conversar com ele e montar uma nova versão?</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_240px]">
        <PropostaDocumento proposta={p} className="min-w-0" />
        <aside className="lg:sticky lg:top-8 lg:self-start">
          <h2 className="h6 mb-4 uppercase tracking-wide">Acompanhamento</h2>
          <ol className="flex flex-col gap-4">
            <Marco feito titulo="Criada" quando={p.created_at} />
            <Marco feito={Boolean(p.sent_at)} titulo="Enviada" quando={p.sent_at} />
            <Marco feito={Boolean(p.viewed_at)} titulo="Visualizada pelo cliente" quando={p.viewed_at} />
            <Marco
              feito={Boolean(p.answered_at)}
              titulo={p.status === "rejeitada" ? "Recusada" : "Aceita"}
              quando={p.answered_at}
            />
          </ol>
        </aside>
      </div>
    </div>
  );
}
