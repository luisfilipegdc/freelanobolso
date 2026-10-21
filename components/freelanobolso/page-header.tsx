import * as React from "react";

/** Título h1 + descrição (texto-grande) + ações à direita — layout padrão das páginas do app. */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: React.ReactNode;
  description?: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <header className="flex flex-col gap-4 border-b border-neutro-200 pb-5 md:flex-row md:items-end md:justify-between">
      <div className="min-w-0">
        <h1 className="h1">{title}</h1>
        {description && <p className="texto-grande mt-1 max-w-3xl">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </header>
  );
}
