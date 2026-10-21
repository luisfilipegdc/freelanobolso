import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: Omit<React.ComponentProps<"input">, "type">) {
  return (
    <input
      type="checkbox"
      data-slot="checkbox"
      className={cn(
        "size-4 shrink-0 cursor-pointer rounded border-neutro-300 accent-primaria-600 outline-none focus-visible:ring-4 focus-visible:ring-primaria-100",
        className,
      )}
      {...props}
    />
  );
}

export { Checkbox };
