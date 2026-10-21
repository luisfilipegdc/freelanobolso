import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { applyRememberChoice, REMEMBER_COOKIE, supabaseKey, supabaseUrl, variaveisFaltando } from "./env";

/** Rotas que só fazem sentido para quem ainda não entrou. */
const GUEST_ONLY = ["/entrar", "/criar-conta", "/esqueci-a-senha"];

/** Rotas abertas: auth, callback e links públicos (proposta, contrato, área do cliente). */
const PUBLIC = [...GUEST_ONLY, "/auth", "/proposta", "/contrato", "/c"];

function matches(pathname: string, routes: string[]) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

/** Sem URL/chave o Supabase lança erro e o deploy mostra só "Internal Server Error". */
function configuracaoAusente(faltando: string[]) {
  const itens = faltando.map((nome) => `<li><code>${nome}</code></li>`).join("");
  const html = `<!doctype html><html lang="pt-BR"><meta charset="utf-8"><title>Configuração pendente</title>
<body style="font-family:system-ui,sans-serif;max-width:560px;margin:64px auto;padding:0 16px;color:#101828">
<h1 style="font-size:24px">Falta configurar o Supabase</h1>
<p>Cadastre estas variáveis de ambiente (na Vercel: Settings → Environment Variables) e faça um novo deploy:</p>
<ul>${itens}</ul></body></html>`;
  return new NextResponse(html, { status: 503, headers: { "content-type": "text/html; charset=utf-8" } });
}

export async function updateSession(request: NextRequest) {
  const faltando = variaveisFaltando();
  if (faltando.length) return configuracaoAusente(faltando);

  let response = NextResponse.next({ request });
  const remember = request.cookies.get(REMEMBER_COOKIE)?.value;

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, applyRememberChoice(options, remember)),
        );
        Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
      },
    },
  });

  // Não colocar código entre createServerClient e getClaims: é o que renova a sessão.
  const { data } = await supabase.auth.getClaims();
  const isLoggedIn = Boolean(data?.claims);
  const { pathname } = request.nextUrl;

  const redirectTo = (path: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    url.search = "";
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  };

  // "Nos conte mais sobre você" vem logo após o cadastro, então exige login.
  const isOnboarding = pathname.startsWith("/criar-conta/sobre-voce");

  if (!isLoggedIn && (isOnboarding || !matches(pathname, PUBLIC)) && pathname !== "/") {
    return redirectTo("/entrar");
  }
  if (isLoggedIn && !isOnboarding && matches(pathname, GUEST_ONLY)) {
    return redirectTo("/inicio");
  }

  return response;
}
