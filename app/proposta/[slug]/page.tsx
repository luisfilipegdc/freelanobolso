import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { buscarPropostaPublica } from "./dados";
import { RespostaCliente } from "./resposta-cliente";
import { Logo } from "@/components/freelanobolso/logo";
import { PropostaDocumento } from "@/components/freelanobolso/proposta-documento";
import { vencida } from "@/lib/propostas";

export async function generateMetadata({ params }: PageProps<"/proposta/[slug]">): Promise<Metadata> {
  const p = await buscarPropostaPublica((await params).slug);
  return {
    title: p ? `${p.title} — Proposta de ${p.freelancer.company_name || p.freelancer.name}` : "Proposta não encontrada",
    robots: { index: false, follow: false },
  };
}

export default async function PropostaPublicaPage({ params }: PageProps<"/proposta/[slug]">) {
  const { slug } = await params;
  const p = await buscarPropostaPublica(slug);
  if (!p) notFound();

  return (
    <div className="min-h-dvh bg-neutro-50 px-4 py-8 sm:py-12">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        {p.is_owner && (
          <p className="rounded-lg border border-alerta-300 bg-alerta-25 px-4 py-3 text-sm text-alerta-700">
            Você está vendo a proposta como o cliente verá. Os botões de resposta ficam desativados para você.
          </p>
        )}
        <PropostaDocumento proposta={p}>
          <RespostaCliente
            slug={slug}
            titulo={p.title}
            status={p.status}
            vencida={vencida(p)}
            expiresAt={p.expires_at}
            answeredAt={p.answered_at}
            isOwner={p.is_owner}
            freelancer={p.freelancer}
          />
        </PropostaDocumento>
        <Logo className="mx-auto opacity-70" />
      </div>
    </div>
  );
}
