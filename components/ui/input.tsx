import * as React from "react";
import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-11 w-full min-w-0 rounded-md border border-neutro-300 bg-branco px-3.5 text-base text-neutro-900 shadow-xs outline-none transition-[color,box-shadow] placeholder:text-neutro-500 md:text-sm",
        "focus-visible:border-primaria-300 focus-visible:ring-4 focus-visible:ring-primaria-100",
        "aria-invalid:border-erro-300 aria-invalid:focus-visible:ring-erro-100",
        "disabled:cursor-not-allowed disabled:bg-neutro-50 disabled:text-neutro-500",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
