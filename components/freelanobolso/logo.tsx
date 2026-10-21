import Link from "next/link";
import { cn } from "@/lib/utils";

/** Wordmark "Freela no Bolso", com "Bolso" na cor primária (docs/05-design-system.md). */
export function Logo({ href = "/", className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-2.5", className)} aria-label="Freela no Bolso">
      <svg viewBox="0 0 32 32" className="size-8 shrink-0" aria-hidden>
        <rect width="32" height="32" rx="8" fill="var(--primaria-600)" />
        <path d="M8 9h16v9a8 8 0 0 1-16 0V9Z" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M8 13h16" stroke="#fff" strokeWidth="2.5" />
      </svg>
      <span className="text-xl font-semibold tracking-tight text-neutro-900">
        Freela no <span className="text-primaria-600">Bolso</span>
      </span>
    </Link>
  );
}
