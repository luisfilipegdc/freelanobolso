import * as React from "react";
import { dataBR, diaEmBrasilia, hojeISO, somarDias } from "@/lib/datas";
import { formatarDinheiro } from "@/lib/mascaras";
import { MEIOS_PAGAMENTO, totais, type PropostaDoc } from "@/lib/propostas";
import { cn } from "@/lib/utils";

function Secao({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section className="flex flex-col gap-3 border-t border-neutro-200 pt-8">
      <h2 className="h6 uppercase tracking-wide">{titulo}</h2>
      {children}
    </section>
  );
}

const Paragrafos = ({ texto }: { texto: string }) => <p className="texto-grande whitespace-pre-line">{texto}</p>;

/**
 * A proposta como o cliente vê ("Estrutura da Proposta"): Capa · Informações · Apresentação ·
 * Objetivo · Serviços · Desconto · Prazo · Pagamento · Observações. O CTA entra por `children`.
 */
export function PropostaDocumento({
  proposta: p,
  children,
  className,
}: {
  proposta: PropostaDoc;
  children?: React.ReactNode;
  className?: string;
}) {
  const { subtotal, desconto, total } = totais(p.items, p.discount_pct);
  const inicioPrazo = p.sent_at ? diaEmBrasilia(p.sent_at) : hojeISO();
  const meios = MEIOS_PAGAMENTO.filter((m) => p.payment_methods?.includes(m.value)).map((m) => m.label);
  const de = p.freelancer.company_name || p.freelancer.name;

  return (
    <article className={cn("overflow-hidden rounded-xl border border-neutro-200 bg-branco", className)}>
      {p.cover_url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.cover_url} alt="" className="aspect-[3/1] w-full object-cover" />
      ) : (
        <div className="aspect-[3/1] w-full bg-linear-to-br from-primaria-600 to-primaria-900" />
      )}

      <div className="flex flex-col gap-8 px-6 py-8 sm:px-12 sm:py-10">
        <header className="flex flex-col gap-6">
          <div>
            <p className="texto-destaque">Proposta comercial</p>
            <h1 className="h1 mt-1 text-3xl break-words sm:text-4xl">{p.title}</h1>
          </div>
          <dl className="grid gap-4 sm:grid-cols-3">
            <div>
              <dt className="h6">Para</dt>
              <dd className="h5">{p.cliente?.name ?? "—"}</dd>
            </div>
            <div>
              <dt className="h6">De</dt>
              <dd className="h5">{de}</dd>
            </div>
            <div>
              <dt className="h6">{p.expires_at ? "Válida até" : "Data"}</dt>
              <dd className="h5">{dataBR(p.expires_at ?? diaEmBrasilia(p.sent_at ?? p.created_at))}</dd>
            </div>
          </dl>
        </header>

        {p.presentation && (
          <Secao titulo="Apresentação">
            <Paragrafos texto={p.presentation} />
          </Secao>
        )}

        {p.objective && (
          <Secao titulo="Objetivo">
            <Paragrafos texto={p.objective} />
          </Secao>
        )}

        <Secao titulo="Serviços">
          {p.items.length === 0 ? (
            <p className="texto">Nenhum serviço adicionado.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-neutro-200">
              {p.items.map((item, i) => (
                <li key={i} className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:justify-between sm:gap-6">
                  <div className="min-w-0">
                    <p className="h4 text-neutro-900">
                      {item.name}
                      {Number(item.quantity) > 1 && <span className="texto"> × {item.quantity}</span>}
                    </p>
                    {item.description && <p className="texto whitespace-pre-line">{item.description}</p>}
                  </div>
                  <p className="h5 shrink-0">{formatarDinheiro(Number(item.quantity) * Number(item.unit_price))}</p>
                </li>
              ))}
            </ul>
          )}
          <dl className="flex flex-col gap-2 rounded-lg bg-neutro-50 p-4">
            {desconto > 0 && (
              <>
                <div className="flex justify-between">
                  <dt className="texto">Subtotal</dt>
                  <dd className="texto">{formatarDinheiro(subtotal)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="texto">Desconto ({Number(p.discount_pct)}%)</dt>
                  <dd className="texto-sucesso">− {formatarDinheiro(desconto)}</dd>
                </div>
              </>
            )}
            <div className="flex justify-between">
              <dt className="h4 text-neutro-900">Total</dt>
              <dd className="h3">{formatarDinheiro(total)}</dd>
            </div>
          </dl>
        </Secao>

        {p.deadline_days ? (
          <Secao titulo="Prazo">
            <p className="texto-grande">
              {p.deadline_days} {p.deadline_business_days ? "dias úteis" : "dias corridos"}, com entrega prevista para{" "}
              {dataBR(somarDias(inicioPrazo, p.deadline_days, Boolean(p.deadline_business_days)))} se o projeto começar
              em {dataBR(inicioPrazo)}.
            </p>
          </Secao>
        ) : null}

        <Secao titulo="Pagamento">
          <p className="texto-grande">
            {p.payment_structure === "parcelado" ? "Parcelado" : "À vista"}
            {meios.length > 0 && ` · ${meios.join(", ")}`}
          </p>
          {p.payment_structure === "parcelado" && p.installments_description && (
            <Paragrafos texto={p.installments_description} />
          )}
        </Secao>

        {p.notes && (
          <Secao titulo="Observações">
            <Paragrafos texto={p.notes} />
          </Secao>
        )}

        {children}

        <footer className="border-t border-neutro-200 pt-6 text-center">
          <p className="texto-pequeno">
            Proposta elaborada utilizando o Freela no Bolso, isto é um sinal de que este freelancer é organizado! :)
          </p>
        </footer>
      </div>
    </article>
  );
}
