import type { Metadata } from "next";
import { EmConstrucao } from "@/components/freelanobolso/em-construcao";

export const metadata: Metadata = { title: "Finanças" };

export default function Page() {
  return (
    <EmConstrucao
      title="Finanças"
      description="Controle seus gastos e ganhos, acompanhe o seu lucro e os pagamentos pendentes."
      fase={6}
    />
  );
}
