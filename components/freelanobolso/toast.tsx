"use client";

import * as React from "react";
import { CheckCircle2, Trophy, X } from "lucide-react";

type Toast = { id: number; message: string; kind: "pontos" | "sucesso" };

const ToastContext = React.createContext<(message: string, kind?: Toast["kind"]) => void>(() => {});

/** Toasts no canto da tela. Pontos: "Parabéns, você ganhou X pontos!" (CLAUDE.md). */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([]);
  const nextId = React.useRef(0);

  const dismiss = React.useCallback((id: number) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const show = React.useCallback(
    (message: string, kind: Toast["kind"] = "sucesso") => {
      const id = ++nextId.current;
      setToasts((t) => [...t, { id, message, kind }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  return (
    <ToastContext value={show}>
      {children}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-50 flex flex-col items-end gap-3 sm:left-auto"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-lg border border-neutro-200 bg-branco p-4 shadow-lg"
          >
            {t.kind === "pontos" ? (
              <Trophy className="size-5 shrink-0 text-bronze" />
            ) : (
              <CheckCircle2 className="size-5 shrink-0 text-sucesso-600" />
            )}
            <p className="h5 flex-1">{t.message}</p>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded p-1 text-neutro-400 hover:text-neutro-600"
              aria-label="Fechar aviso"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext>
  );
}

export function useToast() {
  const show = React.use(ToastContext);
  return {
    sucesso: (message: string) => show(message, "sucesso"),
    pontos: (pontos: number) => show(`Parabéns, você ganhou ${pontos} ${pontos === 1 ? "ponto" : "pontos"}!`, "pontos"),
  };
}
