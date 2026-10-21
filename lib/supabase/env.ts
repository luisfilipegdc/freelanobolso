export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// A integração Supabase da Vercel cria NEXT_PUBLIC_SUPABASE_ANON_KEY; aceitamos as duas.
export const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!;

/** Nomes das variáveis que faltam para conectar ao Supabase (vazio = tudo certo). */
export function variaveisFaltando() {
  const faltando: string[] = [];
  if (!supabaseUrl) faltando.push("NEXT_PUBLIC_SUPABASE_URL");
  if (!supabaseKey) faltando.push("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  return faltando;
}

/** Cookie que guarda a escolha "Permanecer conectado" da tela Entrar. */
export const REMEMBER_COOKIE = "fnb_lembrar";

type CookieOptions = { maxAge?: number; expires?: Date };

/**
 * Sem "Permanecer conectado", os cookies de sessão do Supabase viram cookies
 * de sessão do navegador (somem ao fechar o navegador).
 */
export function applyRememberChoice<T extends CookieOptions>(options: T, remember: string | undefined): T {
  if (remember !== "0") return options;
  const rest = { ...options };
  delete rest.maxAge;
  delete rest.expires;
  return rest;
}
