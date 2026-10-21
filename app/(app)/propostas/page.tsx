import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Propostas" };

export default function Page() {
  return (
    <EmConstrucao
      title="Propostas"
      description="Automatize a criação de propostas comerciais de alta conversão e acompanhe o status de cada uma."
      fase={3}
    />
  );
}
