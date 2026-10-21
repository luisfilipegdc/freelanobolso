import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Configurações" };

export default function Page() {
  return (
    <EmConstrucao
      title="Configurações"
      description="Gerencie as informações e a identidade visual do seu negócio, bem como o seu plano e extrato no Freela no Bolso."
      fase={8}
    />
  );
}
