import { Badge } from "@/components/ui/badge";
import { exigirUsuario } from "@/lib/acoes";
import { formatarData, formatarDinheiro } from "@/lib/mascaras";
import { STATUS_CONTRATO, STATUS_PROJETO, STATUS_PROPOSTA, TIPO_PROJETO } from "@/lib/status";

function Tabela({ colunas, vazio, children }: { colunas: string[]; vazio: string; children: React.ReactNode[] }) {
  if (children.length === 0) {
    return <p className="texto rounded-xl border border-neutro-200 bg-branco px-6 py-10 text-center">{vazio}</p>;
  }
  return (
    <div className="relative overflow-x-auto rounded-xl border border-neutro-200 bg-branco">
      <table className="w-full min-w-[560px] text-left">
        <thead className="border-b border-neutro-200 bg-neutro-50">
          <tr>
            {colunas.map((c) => (
              <th key={c} className="h6 px-6 py-3">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutro-200">{children}</tbody>
      </table>
    </div>
  );
}

/** "aaaa-mm-dd" de hoje no horário de Brasília. */
const hoje = () => new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());

export async function AbaProjetos({ pessoaId }: { pessoaId: string }) {
  const { supabase } = await exigirUsuario();
  const { data: projetos } = await supabase
    .from("projects")
    .select("id, title, kind, status, due_date, total_value, transactions(amount, type)")
    .eq("person_id", pessoaId)
    .order("created_at", { ascending: false });

  return (
    <Tabela
      colunas={["Projeto", "Tipo", "Status", "Prazo", "Valor Pago"]}
      vazio="Esta pessoa ainda não tem projetos. Quando você criar um projeto para ela, ele aparece aqui."
    >
      {(projetos ?? []).map((p) => {
        const pago = (p.transactions ?? [])
          .filter((t: { type: string }) => t.type === "receita")
          .reduce((acc: number, t: { amount: number }) => acc + Number(t.amount), 0);
        const ativo = p.status === "aguardando_inicio" || p.status === "em_andamento";
        const atrasado = ativo && p.due_date && p.due_date < hoje();
        const status = STATUS_PROJETO[p.status];
        return (
          <tr key={p.id}>
            <td className="h5 px-6 py-4">{p.title}</td>
            <td className="texto px-6 py-4">{TIPO_PROJETO[p.kind]}</td>
            <td className="px-6 py-4">
              <Badge variant={status.cor}>{status.label}</Badge>
            </td>
            <td className="px-6 py-4">
              {ativo && p.due_date ? (
                <Badge variant={atrasado ? "erro" : "sucesso"}>{atrasado ? "Atrasado" : "No prazo"}</Badge>
              ) : (
                <span className="texto">—</span>
              )}
            </td>
            <td className="texto px-6 py-4">
              {formatarDinheiro(pago)} de {formatarDinheiro(Number(p.total_value ?? 0))}
            </td>
          </tr>
        );
      })}
    </Tabela>
  );
}

export async function AbaPagamentos({ pessoaId }: { pessoaId: string }) {
  const { supabase } = await exigirUsuario();
  const { data: pagamentos } = await supabase
    .from("transactions")
    .select("id, date, description, amount")
    .eq("person_id", pessoaId)
    .eq("type", "receita")
    .order("date", { ascending: false });

  return (
    <Tabela colunas={["Data", "Descrição", "Valor"]} vazio="Nenhum pagamento registrado para esta pessoa.">
      {(pagamentos ?? []).map((t) => (
        <tr key={t.id}>
          <td className="texto px-6 py-4">{formatarData(`${t.date}T12:00:00`)}</td>
          <td className="h5 px-6 py-4">{t.description}</td>
          <td className="texto-sucesso px-6 py-4">{formatarDinheiro(Number(t.amount))}</td>
        </tr>
      ))}
    </Tabela>
  );
}

export async function AbaDocumentos({ pessoaId }: { pessoaId: string }) {
  const { supabase } = await exigirUsuario();
  const [{ data: propostas }, { data: contratos }] = await Promise.all([
    supabase.from("proposals").select("id, title, status, created_at").eq("person_id", pessoaId),
    supabase.from("contracts").select("id, title, status, created_at").eq("person_id", pessoaId),
  ]);

  const documentos = [
    ...(propostas ?? []).map((d) => ({ ...d, tipo: "Proposta", status: STATUS_PROPOSTA[d.status] })),
    ...(contratos ?? []).map((d) => ({ ...d, tipo: "Contrato", status: STATUS_CONTRATO[d.status] })),
  ].sort((a, b) => b.created_at.localeCompare(a.created_at));

  return (
    <Tabela colunas={["Documento", "Status"]} vazio="Nenhuma proposta ou contrato para esta pessoa ainda.">
      {documentos.map((d) => (
        <tr key={d.id}>
          <td className="px-6 py-4">
            <span className="h5 block">{d.title}</span>
            <span className="texto-pequeno">
              {d.tipo} · Criado em {formatarData(d.created_at)}
            </span>
          </td>
          <td className="px-6 py-4">
            <Badge variant={d.status.cor}>{d.status.label}</Badge>
          </td>
        </tr>
      ))}
    </Tabela>
  );
}
