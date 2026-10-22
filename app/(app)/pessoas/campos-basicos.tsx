"use client";

import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { MaskedInput } from "@/components/freelanobolso/masked-input";
import type { Pessoa, TipoPessoa } from "@/lib/pessoas";

/** Campos de Dados Básicos que mudam entre PF e PJ (modal Adicionar pessoa e aba Dados). */
export function CamposBasicos({
  tipo,
  pessoa,
  erros,
}: {
  tipo: TipoPessoa;
  pessoa?: Partial<Pessoa>;
  erros?: Record<string, string>;
}) {
  if (tipo === "pf") {
    return (
      <>
        <Field label="Nome" htmlFor="name" error={erros?.name}>
          <Input id="name" name="name" placeholder="Ex.: Maria Silva" defaultValue={pessoa?.name} required autoFocus />
        </Field>
        <Field label="Email" htmlFor="email" optional error={erros?.email}>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="maria@email.com"
            defaultValue={pessoa?.email ?? ""}
          />
        </Field>
        <Field label="Telefone" htmlFor="phone" optional>
          <MaskedInput id="phone" name="phone" mask="telefone" type="tel" defaultValue={pessoa?.phone} />
        </Field>
      </>
    );
  }

  return (
    <>
      <Field label="Empresa" htmlFor="name" error={erros?.name}>
        <Input id="name" name="name" placeholder="Ex.: Petshop Aumigo" defaultValue={pessoa?.name} required autoFocus />
      </Field>
      <Field label="Nome do Representante" htmlFor="rep_name" optional>
        <Input id="rep_name" name="rep_name" placeholder="Ex.: Maria Silva" defaultValue={pessoa?.rep_name ?? ""} />
      </Field>
      <Field label="Email do Representante" htmlFor="rep_email" optional error={erros?.rep_email}>
        <Input
          id="rep_email"
          name="rep_email"
          type="email"
          placeholder="maria@empresa.com"
          defaultValue={pessoa?.rep_email ?? ""}
        />
      </Field>
      <Field label="Telefone do Representante" htmlFor="rep_phone" optional>
        <MaskedInput id="rep_phone" name="rep_phone" mask="telefone" type="tel" defaultValue={pessoa?.rep_phone} />
      </Field>
    </>
  );
}

export const OPCOES_TIPO: { value: TipoPessoa; label: string }[] = [
  { value: "pf", label: "Pessoa Física" },
  { value: "pj", label: "Pessoa Jurídica" },
];
