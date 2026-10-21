"use client";

import { useActionState } from "react";
import Link from "next/link";
import { salvarSobreVoce, type FormState } from "../../actions";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/freelanobolso/submit-button";
import { AREAS_DE_ATUACAO, FAIXAS_DE_FATURAMENTO, TAMANHOS_DE_EQUIPE } from "@/lib/opcoes";

export function SobreVoceForm() {
  const [state, action] = useActionState<FormState, FormData>(salvarSobreVoce, {});

  return (
    <form action={action} className="flex flex-col gap-5">
      {state.error && <Alert>{state.error}</Alert>}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium text-neutro-700">Áreas de atuação</legend>
        <div className="flex flex-wrap gap-2">
          {AREAS_DE_ATUACAO.map((area) => (
            <label key={area} className="cursor-pointer">
              <input type="checkbox" name="areas" value={area} className="peer sr-only" />
              <span className="inline-flex rounded-full border border-neutro-300 px-3 py-1.5 text-sm font-medium text-neutro-700 transition-colors peer-checked:border-primaria-600 peer-checked:bg-primaria-50 peer-checked:text-primaria-700 peer-focus-visible:ring-4 peer-focus-visible:ring-primaria-100">
                {area}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <Field label="Tamanho da Equipe" htmlFor="team_size">
        <Select id="team_size" name="team_size" defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          {TAMANHOS_DE_EQUIPE.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </Select>
      </Field>

      <Field label="Faturamento Mensal" htmlFor="monthly_revenue_range">
        <Select id="monthly_revenue_range" name="monthly_revenue_range" defaultValue="">
          <option value="" disabled>
            Selecione
          </option>
          {FAIXAS_DE_FATURAMENTO.map((f) => (
            <option key={f}>{f}</option>
          ))}
        </Select>
      </Field>

      <SubmitButton size="lg" className="w-full" pendingText="Salvando…">
        Continuar para a plataforma
      </SubmitButton>
      <Link href="/inicio" className="h5-destaque text-center hover:underline">
        Pular perguntas
      </Link>

      <p className="texto-pequeno text-center">
        Suas respostas são usadas apenas para melhorar a sua experiência e nunca são compartilhadas.
      </p>
    </form>
  );
}
