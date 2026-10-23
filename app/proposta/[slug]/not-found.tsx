import { Logo } from "@/components/freelanobolso/logo";

export default function PropostaNaoEncontrada() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-neutro-50 px-4 text-center">
      <Logo />
      <div>
        <h1 className="h2">Proposta não encontrada</h1>
        <p className="texto-grande mt-2 max-w-md">
          O link pode estar incompleto ou a proposta foi excluída. Peça um novo link para quem te enviou.
        </p>
      </div>
    </div>
  );
}
