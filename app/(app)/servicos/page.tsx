import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Serviços" };

export default function Page() {
  return (
    <EmConstrucao
      title="Serviços"
      description="Cadastre os serviços que presta atualmente e monte propostas e contratos em segundos."
      fase={2}
    />
  );
}
