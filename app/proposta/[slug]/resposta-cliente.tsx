"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Clock, Loader2, MessageCircle, ThumbsUp, XCircle } from "lucide-react";
import { registrarVisualizacao, responderProposta } from "./actions";
import { Alert } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogActions } from "@/components/ui/dialog";
import { dataBR, diaEmBrasilia } from "@/lib/datas";
import { linkWhatsApp } from "@/lib/pessoas";
import type { StatusProposta } from "@/lib/propostas";

function Aviso({ icone, titulo, texto }: { icone: React.ReactNode; titulo: string; texto: string }) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-xl bg-neutro-50 px-6 py-8 text-center [&_svg]:size-8">
      {icone}
      <p className="h3">{titulo}</p>
      <p className="texto max-w-md">{texto}</p>
    </div>
  );
}

/** CTA "Vamos trabalhar juntos": Enviar mensagem / Aceitar proposta (e recusar, discretamente). */
export function RespostaCliente({
  slug,
  titulo,
  status,
  vencida,
  expiresAt,
  answeredAt,
  isOwner,
  freelancer,
}: {
  slug: string;
  titulo: string;
  status: StatusProposta;
  vencida: boolean;
  expiresAt: string | null;
  answeredAt: string | null;
  isOwner: boolean;
  freelancer: { name: string; company_name: string | null; phone: string | null; email: string | null };
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmando, setConfirmando] = useState<"aceitar" | "recusar" | null>(null);
  const [erro, setErro] = useState<string>();
  const nome = freelancer.name.split(" ")[0];

  useEffect(() => {
    if (!isOwner && status === "enviada") registrarVisualizacao(slug);
  }, [isOwner, status, slug]);

  const texto = `Olá, ${nome}! Vi a proposta "${titulo}" e queria conversar.`;
  const whatsapp = linkWhatsApp(freelancer.phone);
  const contato = whatsapp
    ? `${whatsapp}?text=${encodeURIComponent(texto)}`
    : freelancer.email
      ? `mailto:${freelancer.email}?subject=${encodeURIComponent(`Proposta: ${titulo}`)}`
      : null;

  if (status === "aceita") {
    return (
      <Aviso
        icone={<CheckCircle2 className="text-sucesso-600" />}
        titulo="Proposta aceita!"
        texto={`Aceita em ${answeredAt ? dataBR(diaEmBrasilia(answeredAt)) : "—"}. ${nome} vai entrar em contato para os próximos passos.`}
      />
    );
  }
  if (status === "rejeitada") {
    return (
      <Aviso
        icone={<XCircle className="text-neutro-500" />}
        titulo="Proposta recusada"
        texto={`Se mudar de ideia, é só falar com ${nome}.`}
      />
    );
  }
  if (vencida) {
    return (
      <Aviso
        icone={<Clock className="text-alerta-600" />}
        titulo="Esta proposta venceu"
        texto={`A validade terminou em ${expiresAt ? dataBR(expiresAt) : "—"}. Fale com ${nome} para receber uma versão atualizada.`}
      />
    );
  }

  const responder = (aceitar: boolean) =>
    startTransition(async () => {
      const result = await responderProposta(slug, aceitar);
      if (result.error) return setErro(result.error);
      setConfirmando(null);
      router.refresh();
    });

  return (
    <section className="flex flex-col items-center gap-5 rounded-xl bg-primaria-25 px-6 py-8 text-center">
      <div>
        <h2 className="h2">Vamos trabalhar juntos?</h2>
        <p className="texto-grande">Ficou com alguma dúvida? Mande uma mensagem. Gostou? É só aceitar.</p>
      </div>
      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        {contato && (
          <a
            href={contato}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "secondary", size: "lg" })}
          >
            <MessageCircle />
            Enviar mensagem
          </a>
        )}
        <Button size="lg" onClick={() => setConfirmando("aceitar")} disabled={isOwner}>
          <ThumbsUp />
          Aceitar proposta
        </Button>
      </div>
      <button
        type="button"
        onClick={() => setConfirmando("recusar")}
        disabled={isOwner}
        className="texto-pequeno underline-offset-2 hover:underline disabled:opacity-50"
      >
        Não tenho interesse
      </button>

      <Dialog
        open={confirmando !== null}
        onClose={() => setConfirmando(null)}
        tone={confirmando === "recusar" ? "erro" : "primaria"}
        icon={confirmando === "recusar" ? <XCircle /> : <ThumbsUp />}
        title={confirmando === "recusar" ? "Recusar a proposta?" : `Aceitar a proposta "${titulo}"?`}
        description={
          confirmando === "recusar"
            ? `${nome} vai ver que você recusou. Se quiser negociar, é melhor enviar uma mensagem antes.`
            : `${nome} recebe o aviso e entra em contato para combinar os próximos passos.`
        }
      >
        {erro && <Alert>{erro}</Alert>}
        <DialogActions>
          <Button variant="secondary" onClick={() => setConfirmando(null)} disabled={pending}>
            Voltar
          </Button>
          <Button
            variant={confirmando === "recusar" ? "destructive" : "primary"}
            onClick={() => responder(confirmando === "aceitar")}
            disabled={pending}
          >
            {pending && <Loader2 className="animate-spin" />}
            {confirmando === "recusar" ? "Recusar" : "Aceitar"}
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
}
