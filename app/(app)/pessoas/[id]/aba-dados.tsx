"use client";

import { useState } from "react";
import { Loader2, UploadCloud } from "lucide-react";
import { salvarDadosBasicos, salvarDadosDocumentos } from "../actions";
import { CamposBasicos, OPCOES_TIPO } from "../campos-basicos";
import { Alert } from "@/components/ui/alert";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioCards } from "@/components/ui/radio-cards";
import { Select } from "@/components/ui/select";
import { MaskedInput } from "@/components/freelanobolso/masked-input";
import { PersonAvatar } from "@/components/freelanobolso/person-avatar";
import { SubmitButton } from "@/components/freelanobolso/submit-button";
import { useToast } from "@/components/freelanobolso/toast";
import { useActionForm } from "@/hooks/use-action-form";
import type { ActionState } from "@/lib/acoes";
import { soDigitos, UFS } from "@/lib/mascaras";
import type { Pessoa, TipoPessoa } from "@/lib/pessoas";

function Secao({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-6 border-b border-neutro-200 pb-8 lg:grid-cols-[280px_1fr]">
      <div>
        <h2 className="h5">{title}</h2>
        <p className="texto">{description}</p>
      </div>
      <div className="rounded-xl border border-neutro-200 bg-branco p-6">{children}</div>
    </section>
  );
}

/** Envolve a Server Action para mostrar o toast de sucesso. */
function useSalvar(acao: (prev: ActionState, fd: FormData) => Promise<ActionState>) {
  const toast = useToast();
  return useActionForm(async (prev: ActionState, fd: FormData) => {
    const result = await acao(prev, fd);
    if (result.ok) toast.sucesso("Alterações salvas.");
    return result;
  });
}

export function AbaDados({ pessoa }: { pessoa: Pessoa }) {
  return (
    <div className="flex flex-col gap-8">
      <DadosBasicos pessoa={pessoa} />
      <DadosDocumentos pessoa={pessoa} />
    </div>
  );
}

function DadosBasicos({ pessoa }: { pessoa: Pessoa }) {
  const [tipo, setTipo] = useState<TipoPessoa>(pessoa.type);
  const [preview, setPreview] = useState<string | null>(null);
  const { state, pending, onSubmit } = useSalvar(salvarDadosBasicos.bind(null, pessoa.id));

  return (
    <Secao title="Dados Básicos" description="Informações de contato desta pessoa.">
      <form onSubmit={onSubmit} className="flex flex-col gap-5">
        {state.error && <Alert>{state.error}</Alert>}
        <Field label="Tipo" htmlFor="type">
          <RadioCards name="type" options={OPCOES_TIPO} value={tipo} onChange={setTipo} />
        </Field>
        <CamposBasicos key={tipo} tipo={tipo} pessoa={pessoa} erros={state.fieldErrors} />

        <Field
          label="Foto"
          htmlFor="photo"
          hint="Será vista pelo cliente na área do cliente. SVG, PNG, JPG ou GIF (máx. 800x400, até 2 MB)."
          error={state.fieldErrors?.photo}
        >
          <div className="flex items-center gap-4">
            <PersonAvatar name={pessoa.name} src={preview ?? pessoa.photo_url} className="size-16 text-lg" />
            <label className="flex flex-1 cursor-pointer flex-col items-center gap-1 rounded-lg border border-dashed border-neutro-300 px-4 py-4 text-center hover:bg-neutro-25">
              <UploadCloud className="size-5 text-neutro-500" />
              <span className="h5-destaque">Clique para enviar</span>
              <input
                id="photo"
                name="photo"
                type="file"
                accept="image/svg+xml,image/png,image/jpeg,image/gif"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  setPreview(file ? URL.createObjectURL(file) : null);
                }}
              />
            </label>
          </div>
        </Field>

        <div className="flex justify-end">
          <SubmitButton pending={pending} pendingText="Salvando…">
            Salvar alterações
          </SubmitButton>
        </div>
      </form>
    </Secao>
  );
}

function DadosDocumentos({ pessoa }: { pessoa: Pessoa }) {
  const { state, pending, onSubmit } = useSalvar(salvarDadosDocumentos.bind(null, pessoa.id));
  const [endereco, setEndereco] = useState({
    address: pessoa.address ?? "",
    city: pessoa.city ?? "",
    state: pessoa.state ?? "",
  });
  const [buscandoCep, setBuscandoCep] = useState(false);
  const [erroCep, setErroCep] = useState<string>();
  const erros = state.fieldErrors;

  async function buscarCep(cep: string) {
    const d = soDigitos(cep);
    setErroCep(undefined);
    if (d.length !== 8) return;
    setBuscandoCep(true);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
      const json = await res.json();
      if (json.erro) return setErroCep("CEP não encontrado.");
      setEndereco({
        address: [json.logradouro, json.bairro].filter(Boolean).join(", "),
        city: json.localidade ?? "",
        state: json.uf ?? "",
      });
    } catch {
      setErroCep("Não conseguimos buscar o CEP. Preencha o endereço manualmente.");
    } finally {
      setBuscandoCep(false);
    }
  }

  return (
    <Secao
      title="Dados para Documentos"
      description={
        pessoa.type === "pf"
          ? "Usados para preencher propostas e contratos com esta pessoa."
          : "Dados da empresa usados para preencher propostas e contratos."
      }
    >
      <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-6">
        <input type="hidden" name="type" value={pessoa.type} />
        {state.error && <Alert className="sm:col-span-6">{state.error}</Alert>}

        {pessoa.type === "pf" ? (
          <Field label="CPF" htmlFor="cpf" error={erros?.cpf} className="sm:col-span-3">
            <MaskedInput id="cpf" name="cpf" mask="cpf" defaultValue={pessoa.cpf} />
          </Field>
        ) : (
          <>
            <Field label="Razão Social" htmlFor="legal_name" className="sm:col-span-6">
              <Input id="legal_name" name="legal_name" defaultValue={pessoa.legal_name ?? ""} />
            </Field>
            <Field label="CNPJ" htmlFor="cnpj" error={erros?.cnpj} className="sm:col-span-3">
              <MaskedInput id="cnpj" name="cnpj" mask="cnpj" defaultValue={pessoa.cnpj} />
            </Field>
            <Field label="CPF do Representante" htmlFor="rep_cpf" error={erros?.rep_cpf} className="sm:col-span-3">
              <MaskedInput id="rep_cpf" name="rep_cpf" mask="cpf" defaultValue={pessoa.rep_cpf} />
            </Field>
          </>
        )}

        <Field
          label="CEP"
          htmlFor="cep"
          error={erros?.cep ?? erroCep}
          hint={buscandoCep ? "Buscando endereço…" : undefined}
          className="sm:col-span-3 sm:col-start-1"
        >
          <div className="relative">
            <MaskedInput id="cep" name="cep" mask="cep" defaultValue={pessoa.cep} onValueChange={buscarCep} />
            {buscandoCep && (
              <Loader2 className="absolute right-3.5 top-1/2 size-5 -translate-y-1/2 animate-spin text-neutro-400" />
            )}
          </div>
        </Field>
        <Field label="Endereço" htmlFor="address" className="sm:col-span-6">
          <Input
            id="address"
            name="address"
            value={endereco.address}
            onChange={(e) => setEndereco((v) => ({ ...v, address: e.target.value }))}
          />
        </Field>
        <Field label="Número" htmlFor="address_number" className="sm:col-span-2">
          <Input id="address_number" name="address_number" defaultValue={pessoa.address_number ?? ""} />
        </Field>
        <Field label="Complemento" htmlFor="complement" optional className="sm:col-span-4">
          <Input id="complement" name="complement" defaultValue={pessoa.complement ?? ""} />
        </Field>
        <Field label="Cidade" htmlFor="city" className="sm:col-span-4">
          <Input
            id="city"
            name="city"
            value={endereco.city}
            onChange={(e) => setEndereco((v) => ({ ...v, city: e.target.value }))}
          />
        </Field>
        <Field label="Estado" htmlFor="state" className="sm:col-span-2">
          <Select
            id="state"
            name="state"
            value={endereco.state}
            onChange={(e) => setEndereco((v) => ({ ...v, state: e.target.value }))}
          >
            <option value="">UF</option>
            {UFS.map((uf) => (
              <option key={uf}>{uf}</option>
            ))}
          </Select>
        </Field>

        <div className="flex justify-end sm:col-span-6">
          <SubmitButton pending={pending} pendingText="Salvando…">
            Salvar alterações
          </SubmitButton>
        </div>
      </form>
    </Secao>
  );
}
