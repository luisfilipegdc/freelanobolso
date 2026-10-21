import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// A landing page chega na Fase 9. Até lá, a raiz leva direto para o app ou para o login.
export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  redirect(data?.claims ? "/inicio" : "/entrar");
}
