import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

function Select({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        data-slot="select"
        className={cn(
          "h-11 w-full appearance-none rounded-md border border-neutro-300 bg-branco pl-3.5 pr-10 text-base text-neutro-900 shadow-xs outline-none md:text-sm",
          "focus-visible:border-primaria-300 focus-visible:ring-4 focus-visible:ring-primaria-100",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-5 -translate-y-1/2 text-neutro-500" />
    </div>
  );
}

export { Select };
