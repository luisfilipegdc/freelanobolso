import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { applyRememberChoice, REMEMBER_COOKIE, supabaseKey, supabaseUrl } from "./env";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        const remember = cookieStore.get(REMEMBER_COOKIE)?.value;
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, applyRememberChoice(options, remember)),
          );
        } catch {
          // Chamado de um Server Component: o proxy.ts já renova a sessão.
        }
      },
    },
  });
}
