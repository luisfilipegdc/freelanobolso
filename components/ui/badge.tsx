import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap", {
  variants: {
    variant: {
      neutro: "bg-neutro-100 text-neutro-700",
      primaria: "bg-primaria-50 text-primaria-700",
      sucesso: "bg-sucesso-50 text-sucesso-700",
      alerta: "bg-alerta-50 text-alerta-700",
      erro: "bg-erro-50 text-erro-700",
      rosa: "bg-rosa-50 text-rosa-700",
    },
  },
  defaultVariants: { variant: "neutro" },
});

function Badge({ className, variant, ...props }: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
