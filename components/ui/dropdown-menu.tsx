"use client";

import * as React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

/** Menu ⋯ das tabelas e cards. Fecha ao clicar fora ou apertar Esc. */
function DropdownMenu({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block text-left">
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md p-2 text-neutro-500 hover:bg-neutro-100 hover:text-neutro-700"
      >
        <MoreVertical className="size-5" />
      </button>
      {open && (
        <div
          role="menu"
          onClick={() => setOpen(false)}
          className="absolute right-0 z-30 mt-1 min-w-48 overflow-hidden rounded-lg border border-neutro-200 bg-branco py-1 shadow-lg"
        >
          {children}
        </div>
      )}
    </div>
  );
}

const itemClass =
  "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-neutro-700 hover:bg-neutro-50 [&_svg]:size-4 [&_svg]:text-neutro-500";

function DropdownItem({
  destructive,
  className,
  ...props
}: React.ComponentProps<"button"> & { destructive?: boolean }) {
  return (
    <button
      type="button"
      role="menuitem"
      className={cn(itemClass, destructive && "text-erro-600 [&_svg]:text-erro-600", className)}
      {...props}
    />
  );
}

function DropdownLink({ className, ...props }: React.ComponentProps<"a">) {
  return <a role="menuitem" className={cn(itemClass, className)} {...props} />;
}

export { DropdownMenu, DropdownItem, DropdownLink, itemClass as dropdownItemClass };
