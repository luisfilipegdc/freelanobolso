import "server-only";
import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { PropostaDoc } from "@/lib/propostas";

export type PropostaPublica = PropostaDoc & {
  answered_at: string | null;
  is_owner: boolean;
  freelancer: PropostaDoc["freelancer"] & { phone: string | null; email: string | null };
};

/** Lê a proposta pelo slug via função do banco (o cliente não tem login). */
export const buscarPropostaPublica = cache(async (slug: string): Promise<PropostaPublica | null> => {
  if (!/^[a-z0-9-]{8,80}$/.test(slug)) return null;
  const supabase = await createClient();
  const { data } = await supabase.rpc("proposta_publica", { p_slug: slug });
  return (data as PropostaPublica | null) ?? null;
});
