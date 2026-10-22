import type { Metadata } from "next";
import { Package } from "lucide-react";
import { ServicoMenu } from "./servico-menu";
import { BotaoNovoServico } from "./servico-form";
import { EmptyState } from "@/components/freelanobolso/empty-state";
import { PageHeader } from "@/components/freelanobolso/page-header";
import { exigirUsuario } from "@/lib/acoes";
import { formatarDinheiro } from "@/lib/mascaras";
import type { Servico } from "@/lib/servicos";

export const metadata: Metadata = { title: "Serviços" };

export default async function ServicosPage() {
  const { supabase } = await exigirUsuario();
  const { data } = await supabase
    .from("services")
    .select("id, name, description, price")
    .eq("archived", false)
    .order("created_at", { ascending: false });
  const servicos = (data ?? []) as Servico[];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Serviços"
        description="Cadastre os serviços que presta atualmente e monte propostas e contratos em segundos."
        actions={servicos.length ? <BotaoNovoServico /> : undefined}
      />

      {servicos.length === 0 ? (
        <EmptyState
          icon={<Package />}
          title="Você ainda não cadastrou serviços"
          description="Cadastre o que você faz uma vez só e monte propostas e contratos em segundos."
          action={<BotaoNovoServico label="Criar meu primeiro serviço" />}
        />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {servicos.map((s) => (
            <li key={s.id} className="flex flex-col gap-3 rounded-xl border border-neutro-200 bg-branco p-5">
              <div className="flex items-start justify-between gap-2">
                <h2 className="h3 min-w-0 break-words">{s.name}</h2>
                <ServicoMenu servico={s} />
              </div>
              <p className="texto line-clamp-4 flex-1 whitespace-pre-line">{s.description || "Sem descrição."}</p>
              <p className="h5">{s.price != null ? formatarDinheiro(Number(s.price)) : "Preço a combinar"}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
