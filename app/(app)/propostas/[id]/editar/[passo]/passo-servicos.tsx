"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { salvarServicos } from "../../../actions";
import { RodapePasso } from "./rodape";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MoneyInput } from "@/components/freelanobolso/masked-input";
import { useActionForm } from "@/hooks/use-action-form";
import { formatarDinheiro, lerDinheiro, mascaraDinheiro } from "@/lib/mascaras";
import { totais } from "@/lib/propostas";
import type { PropostaCompleta } from "@/lib/propostas-server";
import type { Servico } from "@/lib/servicos";

type Linha = {
  key: number;
  service_id: string | null;
  name: string;
  description: string;
  quantity: string;
  unit_price: string;
};

const centavos = (v: number | null) => (v != null ? mascaraDinheiro(Number(v).toFixed(2)) : "");

export function PassoServicos({ proposta, catalogo }: { proposta: PropostaCompleta; catalogo: Servico[] }) {
  const { state, pending, onSubmit } = useActionForm(salvarServicos.bind(null, proposta.id));
  const [proximaKey, setProximaKey] = useState(proposta.items.length);
  const [linhas, setLinhas] = useState<Linha[]>(() =>
    proposta.items.map((i, key) => ({
      key,
      service_id: i.service_id ?? null,
      name: i.name,
      description: i.description ?? "",
      quantity: String(i.quantity),
      unit_price: centavos(i.unit_price),
    })),
  );
  const [desconto, setDesconto] = useState(String(Number(proposta.discount_pct ?? 0) || ""));

  const atualizar = (key: number, mudanca: Partial<Linha>) =>
    setLinhas((ls) => ls.map((l) => (l.key === key ? { ...l, ...mudanca } : l)));

  const adicionar = (servico?: Servico) => {
    setLinhas((ls) => [
      ...ls,
      {
        key: proximaKey,
        service_id: servico?.id ?? null,
        name: servico?.name ?? "",
        description: servico?.description ?? "",
        quantity: "1",
        unit_price: centavos(servico?.price ?? null),
      },
    ]);
    setProximaKey((k) => k + 1);
  };

  const {
    subtotal,
    desconto: valorDesconto,
    total,
  } = totais(
    linhas.map((l) => ({ quantity: Number(l.quantity) || 0, unit_price: lerDinheiro(l.unit_price) ?? 0 })),
    Number(desconto.replace(",", ".")) || 0,
  );

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      <p className="texto-grande">Liste os serviços que serão executados e adicione um desconto.</p>
      {state.error && <Alert>{state.error}</Alert>}
      <input type="hidden" name="items" value={JSON.stringify(linhas)} />

      {linhas.length === 0 && (
        <p className="texto rounded-xl border border-dashed border-neutro-300 bg-branco px-6 py-8 text-center">
          Nenhum serviço na proposta ainda. Adicione do seu catálogo ou crie um avulso.
        </p>
      )}

      <ul className="flex flex-col gap-4">
        {linhas.map((l, i) => (
          <li key={l.key} className="flex flex-col gap-4 rounded-xl border border-neutro-200 bg-branco p-5">
            <div className="flex items-start gap-3">
              <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primaria-50 text-xs font-semibold text-primaria-600">
                {i + 1}
              </span>
              <Field label="Serviço" htmlFor={`name-${l.key}`} className="flex-1">
                <Input
                  id={`name-${l.key}`}
                  value={l.name}
                  onChange={(e) => atualizar(l.key, { name: e.target.value })}
                  placeholder="Nome do serviço"
                  required
                />
              </Field>
              <Button
                type="button"
                variant="tertiary"
                size="icon"
                className="mt-6 text-neutro-500 hover:text-erro-600"
                aria-label={`Remover ${l.name || "serviço"}`}
                onClick={() => setLinhas((ls) => ls.filter((x) => x.key !== l.key))}
              >
                <Trash2 />
              </Button>
            </div>
            <Field label="Descrição" htmlFor={`desc-${l.key}`} optional className="sm:pl-10">
              <Textarea
                id={`desc-${l.key}`}
                value={l.description}
                onChange={(e) => atualizar(l.key, { description: e.target.value })}
                className="min-h-20"
              />
            </Field>
            <div className="grid grid-cols-2 gap-4 sm:pl-10 sm:grid-cols-[120px_200px_1fr]">
              <Field label="Quantidade" htmlFor={`qtd-${l.key}`}>
                <Input
                  id={`qtd-${l.key}`}
                  type="number"
                  min={1}
                  max={9999}
                  value={l.quantity}
                  onChange={(e) => atualizar(l.key, { quantity: e.target.value })}
                  required
                />
              </Field>
              <Field label="Preço" htmlFor={`preco-${l.key}`}>
                <MoneyInput
                  id={`preco-${l.key}`}
                  defaultValue={l.unit_price}
                  onValueChange={(v) => atualizar(l.key, { unit_price: v })}
                />
              </Field>
              <p className="col-span-2 self-end pb-2.5 text-right text-sm font-semibold text-neutro-900 sm:col-span-1">
                {formatarDinheiro((Number(l.quantity) || 0) * (lerDinheiro(l.unit_price) ?? 0))}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        {catalogo.length > 0 && (
          <Field label="Adicionar do catálogo" htmlFor="catalogo" className="sm:w-80">
            <Select
              id="catalogo"
              value=""
              onChange={(e) => {
                const s = catalogo.find((c) => c.id === e.target.value);
                if (s) adicionar(s);
              }}
            >
              <option value="">Escolha um serviço</option>
              {catalogo.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                  {s.price != null ? ` — ${formatarDinheiro(Number(s.price))}` : ""}
                </option>
              ))}
            </Select>
          </Field>
        )}
        <Button type="button" variant="secondary" onClick={() => adicionar()}>
          <Plus />
          Adicionar serviço avulso
        </Button>
      </div>
      {catalogo.length === 0 && (
        <p className="texto-pequeno">
          Dica: cadastre seus serviços em{" "}
          <Link href="/servicos" className="texto-pequeno-destaque hover:underline">
            Serviços
          </Link>{" "}
          para montar propostas em segundos.
        </p>
      )}

      <dl className="flex flex-col gap-3 rounded-xl border border-neutro-200 bg-branco p-5">
        <div className="flex justify-between">
          <dt className="texto">Subtotal</dt>
          <dd className="h5">{formatarDinheiro(subtotal)}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt>
            <label htmlFor="discount_pct" className="texto">
              Desconto (%)
            </label>
          </dt>
          <dd className="flex items-center gap-3">
            {valorDesconto > 0 && <span className="texto-sucesso">− {formatarDinheiro(valorDesconto)}</span>}
            <Input
              id="discount_pct"
              name="discount_pct"
              inputMode="decimal"
              value={desconto}
              onChange={(e) => setDesconto(e.target.value.replace(/[^\d,.]/g, "").slice(0, 5))}
              placeholder="0"
              className="w-24 text-right"
              aria-invalid={Boolean(state.fieldErrors?.discount_pct)}
            />
          </dd>
        </div>
        {state.fieldErrors?.discount_pct && <p className="text-sm text-erro-600">{state.fieldErrors.discount_pct}</p>}
        <div className="flex justify-between border-t border-neutro-200 pt-3">
          <dt className="h4 text-neutro-900">Total</dt>
          <dd className="h3">{formatarDinheiro(total)}</dd>
        </div>
      </dl>

      <RodapePasso voltar={`/propostas/${proposta.id}/editar/dados-gerais`} pending={pending}>
        Continuar para as condições
      </RodapePasso>
    </form>
  );
}
