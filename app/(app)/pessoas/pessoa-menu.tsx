"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, Mail, MessageCircle, Trash2 } from "lucide-react";
import { ExcluirPessoa } from "./excluir-pessoa";
import { DropdownItem, DropdownLink, DropdownMenu } from "@/components/ui/dropdown-menu";
import { linkWhatsApp } from "@/lib/pessoas";

/** Menu ⋯ da linha: Enviar WhatsApp, Enviar email, Ver detalhes, Excluir. */
export function PessoaMenu({
  id,
  name,
  email,
  phone,
}: {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}) {
  const router = useRouter();
  const [excluindo, setExcluindo] = useState(false);
  const whatsapp = linkWhatsApp(phone);

  return (
    <>
      <DropdownMenu label={`Ações para ${name}`}>
        {whatsapp && (
          <DropdownLink href={whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircle />
            Enviar WhatsApp
          </DropdownLink>
        )}
        {email && (
          <DropdownLink href={`mailto:${email}`}>
            <Mail />
            Enviar email
          </DropdownLink>
        )}
        <DropdownItem onClick={() => router.push(`/pessoas/${id}`)}>
          <Eye />
          Ver detalhes
        </DropdownItem>
        <DropdownItem destructive onClick={() => setExcluindo(true)}>
          <Trash2 />
          Excluir
        </DropdownItem>
      </DropdownMenu>
      <ExcluirPessoa id={id} name={name} open={excluindo} onClose={() => setExcluindo(false)} />
    </>
  );
}
