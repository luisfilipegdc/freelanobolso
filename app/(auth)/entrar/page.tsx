import type { Metadata } from "next";
import { EntrarForm } from "./entrar-form";
import { AuthHeading } from "../auth-heading";

export const metadata: Metadata = { title: "Entrar" };

/** Erros vindos de redirecionamentos (?erro=codigo). Só códigos conhecidos são exibidos. */
const ERROS: Record<string, string> = {
  google: "Não foi possível entrar com o Google. Tente novamente ou use email e senha.",
  link: "Este link expirou ou já foi usado. Tente novamente.",
};

export default async function EntrarPage({ searchParams }: PageProps<"/entrar">) {
  const { erro } = await searchParams;
  const erroInicial = typeof erro === "string" && Object.hasOwn(ERROS, erro) ? ERROS[erro] : undefined;

  return (
    <>
      <AuthHeading title="Entrar" description="Insira suas credenciais abaixo" />
      <EntrarForm erroInicial={erroInicial} />
    </>
  );
}
