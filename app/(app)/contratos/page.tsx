import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Contratos" };

export default function Page() {
  return (
    <EmConstrucao
      title="Contratos"
      description="Automatize a criação de contratos com validade jurídica, agilize sua rotina com a assinatura eletrônica e acompanhe o status de cada um."
      fase={4}
    />
  );
}
