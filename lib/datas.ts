/** Datas no fuso de Brasília, como "aaaa-mm-dd" (o formato das colunas date do Postgres). */

export function hojeISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date());
}

/** Soma dias corridos ou úteis (pula sábado e domingo; feriados não são considerados). */
export function somarDias(inicioISO: string, dias: number, uteis: boolean) {
  const d = new Date(`${inicioISO}T12:00:00Z`);
  if (!uteis) {
    d.setUTCDate(d.getUTCDate() + dias);
  } else {
    let restantes = dias;
    while (restantes > 0) {
      d.setUTCDate(d.getUTCDate() + 1);
      const dow = d.getUTCDay();
      if (dow !== 0 && dow !== 6) restantes--;
    }
  }
  return d.toISOString().slice(0, 10);
}

/** "2026-10-22" → "22/10/2026" (sem passar por fuso). */
export function dataBR(iso: string) {
  const [a, m, d] = iso.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

/** "2026-10-22" → "22/10" */
export function diaMesBR(iso: string) {
  return dataBR(iso).slice(0, 5);
}

/** Timestamp (timestamptz) → "aaaa-mm-dd" do dia em Brasília. */
export function diaEmBrasilia(timestamp: string) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "America/Sao_Paulo" }).format(new Date(timestamp));
}
