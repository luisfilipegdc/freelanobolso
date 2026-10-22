"use client";

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Modal baseado no <dialog> nativo (foco, Esc e camada de fundo de graça).
 * Padrão do Figma: ícone em círculo + título + texto + conteúdo + 2 botões.
 */
function Dialog({
  open,
  onClose,
  title,
  description,
  icon,
  tone = "primaria",
  className,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  icon?: React.ReactNode;
  tone?: "primaria" | "erro";
  className?: string;
  children: React.ReactNode;
}) {
  const ref = React.useRef<HTMLDialogElement>(null);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      aria-labelledby="dialog-title"
      className={cn(
        "m-auto w-[calc(100%-32px)] max-w-[480px] rounded-xl bg-branco p-0 text-left text-neutro-900 shadow-xl backdrop:bg-neutro-900/60",
        className,
      )}
    >
      {open && (
        <div className="relative flex flex-col gap-5 p-6">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-md p-1.5 text-neutro-400 hover:bg-neutro-50 hover:text-neutro-600"
            aria-label="Fechar"
          >
            <X className="size-5" />
          </button>
          <div className="flex flex-col gap-4 pr-8">
            {icon && (
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border-8 [&_svg]:size-6",
                  tone === "erro"
                    ? "border-erro-50 bg-erro-100 text-erro-600"
                    : "border-primaria-50 bg-primaria-100 text-primaria-600",
                )}
              >
                {icon}
              </span>
            )}
            <div>
              <h2 id="dialog-title" className="h3">
                {title}
              </h2>
              {description && <div className="texto mt-1">{description}</div>}
            </div>
          </div>
          {children}
        </div>
      )}
    </dialog>
  );
}

/** Linha de botões no rodapé do modal (lado a lado, ocupando a largura). */
function DialogActions({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 grid grid-cols-2 gap-3">{children}</div>;
}

export { Dialog, DialogActions };
