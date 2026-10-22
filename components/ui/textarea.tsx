import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "min-h-28 w-full rounded-md border border-neutro-300 bg-branco px-3.5 py-2.5 text-base text-neutro-900 shadow-xs outline-none placeholder:text-neutro-500 md:text-sm",
        "focus-visible:border-primaria-300 focus-visible:ring-4 focus-visible:ring-primaria-100",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
