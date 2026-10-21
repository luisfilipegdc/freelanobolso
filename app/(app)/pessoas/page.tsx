import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Pessoas" };

export default function Page() {
  return (
    <EmConstrucao
      title="Pessoas"
      description="Cadastre as pessoas que têm relação com o seu negócio, tanto clientes como leads, e acompanhe seu histórico com cada um."
      fase={2}
    />
  );
}
