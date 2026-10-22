import Link from "next/link";
import { cn } from "@/lib/utils";

/** Abas que mudam a URL (filtros de listagem e abas de detalhes). */
export function LinkTabs({ tabs, active }: { tabs: { href: string; label: string; key: string }[]; active: string }) {
  return (
    <nav className="-mb-px flex gap-6 overflow-x-auto border-b border-neutro-200" aria-label="Abas">
      {tabs.map((t) => (
        <Link
          key={t.key}
          href={t.href}
          aria-current={t.key === active ? "page" : undefined}
          className={cn(
            "whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors",
            t.key === active
              ? "border-primaria-600 text-primaria-600"
              : "border-transparent text-neutro-500 hover:border-neutro-300 hover:text-neutro-700",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}
