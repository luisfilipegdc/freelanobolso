import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Freela no Bolso", template: "%s | Freela no Bolso" },
  description:
    "Freelancer organizado ganha mais. Simples assim. Pessoas, projetos, propostas, contratos e finanças em uma ferramenta só.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
