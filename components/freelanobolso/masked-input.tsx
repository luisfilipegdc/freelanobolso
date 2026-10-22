"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { mascaraCep, mascaraCnpj, mascaraCpf, mascaraDinheiro, mascaraTelefone } from "@/lib/mascaras";

const MASCARAS = {
  cpf: { fn: mascaraCpf, placeholder: "000.000.000-00" },
  cnpj: { fn: mascaraCnpj, placeholder: "00.000.000/0000-00" },
  cep: { fn: mascaraCep, placeholder: "00000-000" },
  telefone: { fn: mascaraTelefone, placeholder: "(00) 00000-0000" },
  dinheiro: { fn: mascaraDinheiro, placeholder: "0,00" },
};

/** Input com máscara brasileira. Não-controlado por fora: lê-se o valor pelo FormData. */
export function MaskedInput({
  mask,
  defaultValue,
  onValueChange,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "onChange" | "defaultValue" | "value"> & {
  mask: keyof typeof MASCARAS;
  defaultValue?: string | null;
  onValueChange?: (value: string) => void;
}) {
  const { fn, placeholder } = MASCARAS[mask];
  const [value, setValue] = React.useState(() => fn(defaultValue ?? ""));

  return (
    <Input
      inputMode="numeric"
      placeholder={placeholder}
      {...props}
      value={value}
      onChange={(e) => {
        const v = fn(e.target.value);
        setValue(v);
        onValueChange?.(v);
      }}
    />
  );
}

/** Campo de valor em reais com o prefixo "R$". */
export function MoneyInput(props: Omit<React.ComponentProps<typeof MaskedInput>, "mask">) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-neutro-500 md:text-sm">
        R$
      </span>
      <MaskedInput mask="dinheiro" className="pl-10" {...props} />
    </div>
  );
}
