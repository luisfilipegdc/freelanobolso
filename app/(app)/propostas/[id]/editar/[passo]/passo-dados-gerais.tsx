"use client";

import { useState } from "react";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { salvarDadosGerais } from "../../../actions";
import { RodapePasso } from "./rodape";
import { Alert } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActionForm } from "@/hooks/use-action-form";
import { hojeISO } from "@/lib/datas";
import type { PropostaCompleta } from "@/lib/propostas-server";

export function PassoDadosGerais({
  proposta,
  pessoas,
}: {
  proposta: PropostaCompleta;
  pessoas: { id: string; name: string }[];
}) {
  const { state, pending, onSubmit } = useActionForm(salvarDadosGerais.bind(null, proposta.id));
  const [temVencimento, setTemVencimento] = useState(Boolean(proposta.expires_at));
  const [capa, setCapa] = useState<string | null>(proposta.cover_url);
  const [removerCapa, setRemoverCapa] = useState(false);
  const erros = state.fieldErrors;

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6">
      {state.error && <Alert>{state.error}</Alert>}

      <Field label="Nome do Projeto" htmlFor="title" error={erros?.title}>
        <Input
          id="title"
          name="title"
          defaultValue={proposta.title}
          placeholder="Ex.: Site do Petshop Aumigo"
          required
        />
      </Field>

      <Field
        label="Imagem de Capa"
        htmlFor="cover"
        optional
        hint="Tamanho ideal: 936x312. PNG, JPG ou GIF de até 2 MB."
        error={erros?.cover}
      >
        <label className="group relative flex aspect-[3/1] cursor-pointer flex-col items-center justify-center gap-2 overflow-hidden rounded-lg border border-dashed border-neutro-300 bg-neutro-25 text-center hover:bg-neutro-50">
          {capa && !removerCapa ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={capa} alt="" className="absolute inset-0 size-full object-cover" />
          ) : (
            <>
              <ImagePlus className="size-6 text-neutro-500" />
              <span className="h5-destaque">Clique para enviar uma capa</span>
            </>
          )}
          <input
            id="cover"
            name="cover"
            type="file"
            accept="image/png,image/jpeg,image/gif"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setCapa(URL.createObjectURL(file));
                setRemoverCapa(false);
              }
            }}
          />
        </label>
        {capa && (
          <label className="mt-1 flex items-center gap-2 text-sm text-neutro-600">
            <Checkbox name="remover_capa" checked={removerCapa} onChange={(e) => setRemoverCapa(e.target.checked)} />
            Remover capa
          </label>
        )}
      </Field>

      <Field
        label="Cliente"
        htmlFor="person_id"
        error={erros?.person_id}
        hint={pessoas.length === 0 ? undefined : "Precisa ser alguém da sua lista de Pessoas."}
      >
        {pessoas.length === 0 ? (
          <p className="texto rounded-md border border-neutro-200 bg-neutro-25 px-3.5 py-3">
            Você ainda não tem pessoas cadastradas.{" "}
            <Link href="/pessoas" className="h5-destaque hover:underline">
              Cadastre o cliente em Pessoas
            </Link>{" "}
            e volte aqui — o rascunho fica salvo.
          </p>
        ) : (
          <Select id="person_id" name="person_id" defaultValue={proposta.person_id ?? ""}>
            <option value="">Selecione o cliente</option>
            {pessoas.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label="Objetivo" htmlFor="objective" optional hint="Qual o objetivo do cliente com este projeto?">
        <Textarea
          id="objective"
          name="objective"
          defaultValue={proposta.objective ?? ""}
          placeholder="Ex.: Ter um site que apresente os serviços do petshop e facilite o agendamento de banho e tosa."
        />
      </Field>

      <Field
        label="Apresentação"
        htmlFor="presentation"
        optional
        hint="Um texto sobre você e o seu trabalho, que abre a proposta."
      >
        <Textarea
          id="presentation"
          name="presentation"
          defaultValue={proposta.presentation ?? ""}
          placeholder="Ex.: Sou designer há 5 anos e ajudo pequenos negócios a venderem mais pela internet."
        />
      </Field>

      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 text-sm font-medium text-neutro-700">
          <Checkbox
            name="tem_vencimento"
            checked={temVencimento}
            onChange={(e) => setTemVencimento(e.target.checked)}
          />
          Esta proposta tem Data de Vencimento
        </label>
        {temVencimento && (
          <Field label="Vencimento" htmlFor="expires_at" error={erros?.expires_at} className="sm:max-w-60">
            <Input
              id="expires_at"
              name="expires_at"
              type="date"
              min={hojeISO()}
              defaultValue={proposta.expires_at ?? ""}
              required
            />
          </Field>
        )}
      </div>

      <RodapePasso pending={pending}>Continuar para os serviços</RodapePasso>
    </form>
  );
}
