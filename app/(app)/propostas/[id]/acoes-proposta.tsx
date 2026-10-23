"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExternalLink, Pencil, Send, Trash2 } from "lucide-react";
import { EnviarPropostaDialog } from "../enviar";
import { ExcluirProposta } from "../excluir-proposta";
import { Button, buttonVariants } from "@/components/ui/button";

export function AcoesProposta({
  id,
  title,
  slug,
  cliente,
  rascunho,
  editavel,
  abrirEnvio,
}: {
  id: string;
  title: string;
  slug: string | null;
  cliente: { name: string; email: string | null; phone: string | null } | null;
  rascunho: boolean;
  editavel: boolean;
  abrirEnvio: boolean;
}) {
  const router = useRouter();
  const [enviando, setEnviando] = useState(abrirEnvio && Boolean(slug));
  const [excluindo, setExcluindo] = useState(false);

  return (
    <div className="flex flex-wrap gap-3">
      <Button variant="secondary" size="icon" onClick={() => setExcluindo(true)} aria-label="Excluir proposta">
        <Trash2 />
      </Button>
      {slug && !rascunho && (
        <a
          href={`/proposta/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants({ variant: "secondary" })}
        >
          <ExternalLink />
          Ver como cliente
        </a>
      )}
      {editavel && (
        <Link href={`/propostas/${id}/editar/dados-gerais`} className={buttonVariants({ variant: "secondary" })}>
          <Pencil />
          Editar
        </Link>
      )}
      {editavel && (
        <Button onClick={() => (slug ? setEnviando(true) : router.push(`/propostas/${id}/editar/revisao`))}>
          <Send />
          {rascunho ? "Enviar proposta" : "Reenviar"}
        </Button>
      )}

      {slug && (
        <EnviarPropostaDialog
          id={id}
          title={title}
          slug={slug}
          cliente={cliente}
          enviada={!rascunho}
          open={enviando}
          onClose={() => setEnviando(false)}
        />
      )}
      <ExcluirProposta id={id} title={title} open={excluindo} onClose={() => setExcluindo(false)} voltar />
    </div>
  );
}
