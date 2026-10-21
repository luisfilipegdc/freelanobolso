import * as React from "react";
import { cn } from "@/lib/utils";

function Alert({
  variant = "erro",
  className,
  ...props
}: React.ComponentProps<"div"> & { variant?: "erro" | "sucesso" }) {
  return (
    <div
      role={variant === "erro" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3.5 py-3 text-sm",
        variant === "erro" && "border-erro-300 bg-erro-25 text-erro-700",
        variant === "sucesso" && "border-sucesso-300 bg-sucesso-25 text-sucesso-700",
        className,
      )}
      {...props}
    />
  );
}

export { Alert };
