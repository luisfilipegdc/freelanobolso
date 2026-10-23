"use client";

import { useState, useSyncExternalStore, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, Copy, Mail, MessageCircle, Send } from "lucide-react";
import { marcarEnviada, prepararEnvio } from "./actions";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/freelanobolso/toast";
import { linkWhatsApp } from "@/lib/pessoas";
import { mensagemProposta } from "@/lib/propostas";

type Cliente = { name: string; email: string | null; phone: string | null } | null;

const naoMuda = () => () => {};
/** Origem do site (no servidor, a configurada; no navegador, a real). */
export function useOrigem() {
  return useSyncExternalStore(
    naoMuda,
    () => window.location.origin,
    () => process.env.NEXT_PUBLIC_SITE_URL ?? "",
  );
}

/**
 * Ações de envio: gera o link (se preciso), marca como Enviada e então copia / abre WhatsApp / abre email.
 * As janelas são abertas antes do await para o navegador não bloquear como pop-up.
 */
export function useEnviarProposta({ id, title, cliente }: { id: string; title: string; cliente: Cliente }) {
  const router = useRouter();
  const toast = useToast();
  const origem = useOrigem();
  const [pending, startTransition] = useTransition();
  const [erro, setErro] = useState<string>();

  const enviar = (como: "copiar" | "whatsapp" | "email") => {
    const janela = como === "whatsapp" ? window.open("about:blank", "_blank") : null;
    setErro(undefined);
    startTransition(async () => {
      const preparo = await prepararEnvio(id);
      if (!preparo.slug) {
        janela?.close();
        setErro(preparo.error);
        toast.erro(preparo.error ?? "Não foi possível enviar.");
        return;
      }
      const url = `${origem}/proposta/${preparo.slug}`;
      const texto = mensagemProposta(title, cliente?.name ?? null, url);

      if (como === "copiar") {
        await navigator.clipboard.writeText(url).catch(() => {});
        toast.sucesso("Link copiado! A proposta foi marcada como Enviada.");
      } else if (como === "whatsapp") {
        const base = linkWhatsApp(cliente?.phone ?? null) ?? "https://wa.me/";
        if (janela) janela.location.href = `${base}?text=${encodeURIComponent(texto)}`;
      } else {
        const assunto = encodeURIComponent(`Proposta: ${title}`);
        window.location.href = `mailto:${cliente?.email ?? ""}?subject=${assunto}&body=${encodeURIComponent(texto)}`;
      }

      await marcarEnviada(id);
      router.refresh();
    });
  };

  return { enviar, pending, erro };
}

/** Modal "Enviar proposta": link, contatos do cliente e os três jeitos de enviar. */
export function EnviarPropostaDialog({
  id,
  title,
  slug,
  cliente,
  enviada,
  open,
  onClose,
}: {
  id: string;
  title: string;
  slug: string | null;
  cliente: Cliente;
  enviada: boolean;
  open: boolean;
  onClose: () => void;
}) {
  const origem = useOrigem();
  const { enviar, pending } = useEnviarProposta({ id, title, cliente });
  const url = slug ? `${origem}/proposta/${slug}` : "";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      icon={enviada ? <Check /> : <Send />}
      title={enviada ? "Proposta enviada!" : "Enviar proposta"}
      description={
        enviada
          ? "Você pode reenviar pelo mesmo link. Vamos avisar aqui quando o cliente visualizar."
          : "Ao copiar o link, a proposta será considerada como Enviada."
      }
    >
      {url && (
        <div className="flex gap-2">
          <Input readOnly value={url} aria-label="Link da proposta" onFocus={(e) => e.target.select()} />
          <Button variant="secondary" onClick={() => enviar("copiar")} disabled={pending} aria-label="Copiar link">
            <Copy />
          </Button>
        </div>
      )}
      <dl className="grid gap-3 rounded-lg bg-neutro-50 p-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="h6">Email do cliente</dt>
          <dd className="texto break-all">{cliente?.email ?? "Não cadastrado"}</dd>
        </div>
        <div>
          <dt className="h6">WhatsApp do cliente</dt>
          <dd className="texto">{cliente?.phone ?? "Não cadastrado"}</dd>
        </div>
      </dl>
      <div className="grid gap-3 sm:grid-cols-3">
        <Button variant="secondary" onClick={() => enviar("copiar")} disabled={pending}>
          <Copy />
          Copiar link
        </Button>
        <Button variant="secondary" onClick={() => enviar("whatsapp")} disabled={pending}>
          <MessageCircle />
          WhatsApp
        </Button>
        <Button variant="secondary" onClick={() => enviar("email")} disabled={pending}>
          <Mail />
          Email
        </Button>
      </div>
    </Dialog>
  );
}
