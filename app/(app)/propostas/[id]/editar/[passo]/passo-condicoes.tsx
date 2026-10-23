"use client";

import { useState } from "react";
import { salvarCondicoes } from "../../../actions";
import { RodapePasso } from "./rodape";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCards } from "@/components/ui/radio-cards";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { diaMesBR, hojeISO, somarDias } from "@/lib/datas";
import { MEIOS_PAGAMENTO } from "@/lib/propostas";
import type { PropostaCompleta } from "@/lib/propostas-server";

export function PassoCondicoes({ proposta }: { proposta: PropostaCompleta }) {
  const { state, pending, onSubmit } = useActionForm(salvarCondicoes.bind(null, proposta.id));
  const [dias, setDias] = useState(proposta.deadline_days ? String(proposta.deadline_days) : "");
  const [uteis, setUteis] = useState(Boolean(proposta.deadline_business_days));
  const [estrutura, setEstrutura] = useState<"a_vista" | "parcelado">(proposta.payment_structure ?? "a_vista");
  const meios = proposta.payment_methods ?? ["pix"];
  const n = Number(dias);
  const hoje = hojeISO();

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {state.error && <Alert>{state.error}</Alert>}

      <Field
        label="Prazo"
        htmlFor="deadline_days"
        optional
        error={state.fieldErrors?.deadline_days}
        hint={
          n >= 1
            ? `Começando hoje (${diaMesBR(hoje)}), a entrega fica para ${diaMesBR(somarDias(hoje, n, uteis))}.`
            : "Em quantos dias você entrega, a partir do início do projeto."
        }
      >
        <div className="flex gap-3">
          <Input
            id="deadline_days"
            name="deadline_days"
            type="number"
            min={1}
            max={3650}
            value={dias}
            onChange={(e) => setDias(e.target.value)}
            placeholder="Ex.: 30"
            className="w-32"
          />
          <Select
            name="deadline_type"
            value={uteis ? "uteis" : "corridos"}
            onChange={(e) => setUteis(e.target.value === "uteis")}
            aria-label="Tipo de dias"
            className="w-44"
          >
            <option value="corridos">dias corridos</option>
            <option value="uteis">dias úteis</option>
          </Select>
        </div>
      </Field>

      <Field label="Estrutura do Pagamento" htmlFor="payment_structure">
        <RadioCards
          name="payment_structure"
          value={estrutura}
          onChange={setEstrutura}
          options={[
            { value: "a_vista", label: "À vista" },
            { value: "parcelado", label: "Parcelado" },
          ]}
        />
      </Field>

      {estrutura === "parcelado" && (
        <Field label="Descrição das Parcelas" htmlFor="installments_description">
          <Textarea
            id="installments_description"
            name="installments_description"
            defaultValue={proposta.installments_description ?? ""}
            placeholder="Ex.: 50% na entrada, 50% na entrega"
            className="min-h-20"
          />
        </Field>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium text-neutro-700">Meio de Pagamento</legend>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {MEIOS_PAGAMENTO.map((m) => (
            <label key={m.value} className="flex items-center gap-2 text-sm text-neutro-700">
              <Checkbox name="payment_methods" value={m.value} defaultChecked={meios.includes(m.value)} />
              {m.label}
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Observações" htmlFor="notes" optional>
        <Textarea
          id="notes"
          name="notes"
          defaultValue={proposta.notes ?? ""}
          placeholder="Ex.: Inclui 2 rodadas de ajustes. Hospedagem não inclusa."
        />
      </Field>

      <RodapePasso voltar={`/propostas/${proposta.id}/editar/servicos`} pending={pending}>
        Continuar para revisão
      </RodapePasso>
    </form>
  );
}
