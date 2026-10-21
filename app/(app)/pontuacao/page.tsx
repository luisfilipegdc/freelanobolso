import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Pontuação" };

export default function Page() {
  return (
    <EmConstrucao
      title="Pontuação"
      description="Acompanhe o seu nível, suas medalhas... e aproveite a jornada! :)"
      fase={7}
    />
  );
}
