import * as React from "react";

/** Estado vazio das listagens: ícone + título + texto + CTA (docs/03-telas.md). */
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-neutro-200 bg-branco px-6 py-16 text-center">
      <span className="flex size-14 items-center justify-center rounded-full border-8 border-primaria-50 bg-primaria-100 text-primaria-600 [&_svg]:size-6">
        {icon}
      </span>
      <div className="max-w-md">
        <h2 className="h3">{title}</h2>
        <p className="texto mt-1">{description}</p>
      </div>
      {action}
    </div>
  );
}
