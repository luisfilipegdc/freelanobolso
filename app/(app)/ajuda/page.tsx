import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Ajuda" };

export default function Page() {
  return (
    <EmConstrucao
      title="Ajuda"
      description="Tire suas dúvidas nas perguntas frequentes ou fale com o nosso suporte."
      fase={9}
    />
  );
}
