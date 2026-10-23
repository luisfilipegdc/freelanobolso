"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Eye, Mail, MessageCircle, Trash2 } from "lucide-react";
import { useEnviarProposta } from "./enviar";
import { ExcluirProposta } from "./excluir-proposta";
import { DropdownItem, DropdownMenu } from "@/components/ui/dropdown-menu";

/** Menu ⋯: Ver detalhes · Enviar por WhatsApp · Enviar por Email · Copiar Link · Excluir. */
export function PropostaMenu({
  id,
  title,
  cliente,
}: {
  id: string;
  title: string;
  cliente: { name: string; email: string | null; phone: string | null } | null;
}) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);
  const { enviar } = useEnviarProposta({ id, title, cliente });

  return (
    <>
      <DropdownMenu label={`Ações para ${title}`}>
        <DropdownItem onClick={() => router.push(`/propostas/${id}`)}>
          <Eye />
          Ver detalhes
        </DropdownItem>
        <DropdownItem onClick={() => enviar("whatsapp")}>
          <MessageCircle />
          Enviar por WhatsApp
        </DropdownItem>
        <DropdownItem onClick={() => enviar("email")}>
          <Mail />
          Enviar por Email
        </DropdownItem>
        <DropdownItem onClick={() => enviar("copiar")}>
          <Copy />
          Copiar Link
        </DropdownItem>
        <DropdownItem destructive onClick={() => setExcluindo(true)}>
          <Trash2 />
          Excluir
        </DropdownItem>
      </DropdownMenu>
      <ExcluirProposta id={id} title={title} open={excluindo} onClose={() => setExcluindo(false)} />
    </>
  );
}
