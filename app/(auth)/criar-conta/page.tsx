import type { Metadata } from "next";
import { CriarContaForm } from "./criar-conta-form";
import { AuthHeading } from "../auth-heading";

export const metadata: Metadata = { title: "Criar conta" };

export default function CriarContaPage() {
  return (
    <>
      <AuthHeading
        title="Criar conta"
        description="Inicie o seu teste grátis de 14 dias. Pode ficar tranquilo, não pedimos seu cartão de crédito! :)"
      />
      <CriarContaForm />
    </>
  );
}
