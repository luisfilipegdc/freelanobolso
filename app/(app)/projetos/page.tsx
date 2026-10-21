import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Projetos" };

export default function Page() {
  return (
    <EmConstrucao
      title="Projetos"
      description="Acompanhe e gerencie os seus projetos de forma integrada e inteligente."
      fase={5}
    />
  );
}
