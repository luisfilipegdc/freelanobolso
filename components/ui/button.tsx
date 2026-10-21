import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-colors outline-none focus-visible:ring-4 focus-visible:ring-primaria-100 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-primaria-600 text-branco shadow-xs hover:bg-primaria-700",
        secondary: "border border-neutro-300 bg-branco text-neutro-700 shadow-xs hover:bg-neutro-50",
        tertiary: "text-primaria-600 hover:bg-primaria-50 hover:text-primaria-700",
        destructive: "bg-erro-600 text-branco shadow-xs hover:bg-erro-700 focus-visible:ring-erro-100",
        link: "h-auto px-0 text-primaria-600 hover:text-primaria-700 hover:underline",
      },
      size: {
        sm: "h-9 px-3.5",
        md: "h-10 px-4",
        lg: "h-11 px-[18px] text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

function Button({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
