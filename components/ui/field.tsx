import * as React from "react";
import { Label } from "./label";
import { cn } from "@/lib/utils";

/** Label + controle + texto de ajuda/erro, no padrão dos inputs do Figma. */
function Field({
  label,
  htmlFor,
  hint,
  error,
  optional,
  className,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {optional && <span className="font-normal text-neutro-500"> (opcional)</span>}
      </Label>
      {children}
      {error ? (
        <p className="text-sm text-erro-600">{error}</p>
      ) : (
        hint && <p className="text-sm text-neutro-600">{hint}</p>
      )}
    </div>
  );
}

export { Field };
