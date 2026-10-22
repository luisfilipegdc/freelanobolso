/** Máscaras e validações brasileiras (CPF, CNPJ, CEP, telefone, dinheiro). */

export const soDigitos = (v: string) => v.replace(/\D/g, "");

function aplicar(digitos: string, padrao: string) {
  let i = 0;
  let out = "";
  for (const ch of padrao) {
    if (i >= digitos.length) break;
    out += ch === "#" ? digitos[i++] : ch;
  }
  return out;
}

export const mascaraCpf = (v: string) => aplicar(soDigitos(v).slice(0, 11), "###.###.###-##");
export const mascaraCnpj = (v: string) => aplicar(soDigitos(v).slice(0, 14), "##.###.###/####-##");
export const mascaraCep = (v: string) => aplicar(soDigitos(v).slice(0, 8), "#####-###");

export function mascaraTelefone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  return aplicar(d, d.length > 10 ? "(##) #####-####" : "(##) ####-####");
}

export function cpfValido(v: string) {
  const d = soDigitos(v);
  if (d.length !== 11 || /^(\d)\1+$/.test(d)) return false;
  const dv = (len: number) => {
    let soma = 0;
    for (let i = 0; i < len; i++) soma += Number(d[i]) * (len + 1 - i);
    const r = (soma * 10) % 11;
    return r === 10 ? 0 : r;
  };
  return dv(9) === Number(d[9]) && dv(10) === Number(d[10]);
}

export function cnpjValido(v: string) {
  const d = soDigitos(v);
  if (d.length !== 14 || /^(\d)\1+$/.test(d)) return false;
  const dv = (len: number) => {
    const pesos = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const soma = pesos.reduce((acc, p, i) => acc + Number(d[i]) * p, 0);
    const r = soma % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return dv(12) === Number(d[12]) && dv(13) === Number(d[13]);
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

/** 1234.5 → "R$ 1.234,50" */
export const formatarDinheiro = (valor: number) => brl.format(valor).replace(/ /g, " ");

/** Digitação de dinheiro: cada dígito entra pelos centavos. "123456" → "1.234,56" */
export function mascaraDinheiro(v: string) {
  const d = soDigitos(v).replace(/^0+/, "").slice(0, 13);
  if (!d) return "";
  const centavos = d.padStart(3, "0");
  const inteiro = centavos.slice(0, -2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${inteiro},${centavos.slice(-2)}`;
}

/** "1.234,56" → 1234.56 ; "" → null */
export function lerDinheiro(v: string) {
  const d = soDigitos(v);
  return d ? Number(d) / 100 : null;
}

/** "2026-10-22T..." → "22/10/2026" */
export function formatarData(iso: string) {
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo" }).format(new Date(iso));
}

export const UFS = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
] as const;
