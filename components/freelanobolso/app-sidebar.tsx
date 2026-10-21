"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  House,
  LifeBuoy,
  Menu,
  Package,
  PenLine,
  Settings,
  Trophy,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { Logo } from "./logo";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/inicio", label: "Início", icon: House },
  { href: "/pessoas", label: "Pessoas", icon: Users },
  { href: "/projetos", label: "Projetos", icon: Briefcase },
  { href: "/propostas", label: "Propostas", icon: FileText },
  { href: "/contratos", label: "Contratos", icon: PenLine },
  { href: "/servicos", label: "Serviços", icon: Package },
  { href: "/financas", label: "Finanças", icon: Wallet },
  { href: "/pontuacao", label: "Pontuação", icon: Trophy },
];

const NAV_FOOTER = [
  { href: "/configuracoes", label: "Configurações", icon: Settings },
  { href: "/ajuda", label: "Ajuda", icon: LifeBuoy },
];

/** Menu lateral do app. No celular vira barra no topo com menu sanfona. */
export function AppSidebar({ accountCard }: { accountCard: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  const renderItem = ({ href, label, icon: Icon }: (typeof NAV)[number]) => {
    const active = pathname === href || pathname.startsWith(`${href}/`);
    return (
      <li key={href}>
        <Link
          href={href}
          aria-current={active ? "page" : undefined}
          onClick={() => setOpen(false)}
          className={cn(
            "flex items-center gap-3 rounded-md px-3 py-2 text-base font-semibold transition-colors",
            active ? "bg-primaria-50 text-primaria-600" : "text-neutro-700 hover:bg-neutro-50",
          )}
        >
          <Icon className={cn("size-5", active ? "text-primaria-600" : "text-neutro-500")} />
          {label}
        </Link>
      </li>
    );
  };

  return (
    <aside className="sticky top-0 z-20 border-b border-neutro-200 bg-branco lg:h-dvh lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6 lg:pt-8 lg:pb-6">
        <Logo href="/inicio" />
        <button
          type="button"
          className="rounded-md p-2 text-neutro-500 hover:bg-neutro-50 lg:hidden"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <nav
        className={cn(
          "flex-col justify-between gap-6 px-4 pb-6 lg:flex lg:h-[calc(100dvh-104px)] lg:overflow-y-auto",
          open ? "flex max-h-[calc(100dvh-64px)] overflow-y-auto" : "hidden",
        )}
        aria-label="Menu principal"
      >
        <ul className="flex flex-col gap-1">{NAV.map(renderItem)}</ul>
        <div className="flex flex-col gap-6">
          <ul className="flex flex-col gap-1">{NAV_FOOTER.map(renderItem)}</ul>
          {accountCard}
        </div>
      </nav>
    </aside>
  );
}
