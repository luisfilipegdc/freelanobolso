import type { Metadata } from "next";
import { SobreVoceForm } from "./sobre-voce-form";
import { AuthHeading } from "../../auth-heading";

export const metadata: Metadata = { title: "Nos conte mais sobre você" };

export default function SobreVocePage() {
  return (
    <>
      <AuthHeading
        title="Nos conte mais sobre você"
        description="Assim conseguimos deixar o Freela no Bolso com a cara do seu negócio."
      />
      <SobreVoceForm />
    </>
  );
}
