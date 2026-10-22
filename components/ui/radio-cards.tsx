import * as React from "react";
import { cn } from "@/lib/utils";

/** Cards de escolha única (PF/PJ, À vista/Parcelado). Controlado ou não-controlado. */
function RadioCards<T extends string>({
  name,
  options,
  value,
  defaultValue,
  onChange,
  className,
}: {
  name: string;
  options: { value: T; label: string; description?: string }[];
  value?: T;
  defaultValue?: T;
  onChange?: (value: T) => void;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)} role="radiogroup">
      {options.map((o) => (
        <label key={o.value} className="cursor-pointer">
          <input
            type="radio"
            name={name}
            value={o.value}
            className="peer sr-only"
            checked={value === undefined ? undefined : value === o.value}
            defaultChecked={defaultValue === undefined ? undefined : defaultValue === o.value}
            onChange={() => onChange?.(o.value)}
          />
          <span className="flex h-full flex-col rounded-lg border border-neutro-200 px-4 py-3 transition-colors peer-checked:border-primaria-600 peer-checked:bg-primaria-25 peer-checked:ring-1 peer-checked:ring-primaria-600 peer-focus-visible:ring-4 peer-focus-visible:ring-primaria-100">
            <span className="text-sm font-semibold text-neutro-700">{o.label}</span>
            {o.description && <span className="texto-pequeno">{o.description}</span>}
          </span>
        </label>
      ))}
    </div>
  );
}

export { RadioCards };
