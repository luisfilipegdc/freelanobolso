import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type Perfil = {
  id: string;
  email: string;
  name: string;
  company_name: string | null;
  avatar_url: string | null;
  points: number;
};

/** Usuário logado + perfil. Redireciona para /entrar se não houver sessão. */
export const getPerfil = cache(async (): Promise<Perfil> => {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/entrar");

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, name, company_name, avatar_url, points")
    .eq("id", auth.user.id)
    .single();

  return {
    id: auth.user.id,
    email: auth.user.email ?? "",
    name: profile?.name ?? auth.user.email ?? "",
    company_name: profile?.company_name ?? null,
    avatar_url: profile?.avatar_url ?? null,
    points: profile?.points ?? 0,
  };
});
