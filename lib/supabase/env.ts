export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

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
