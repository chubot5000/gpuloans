import { cn } from "logic/utils";
import type { ReactNode } from "react";

interface FormFieldProps {
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormField(props: FormFieldProps) {
  const { label, children, className, labelClassName } = props;

  return (
    <div className={cn("flex flex-col gap-2.5 md:gap-4.5 justify-end", className)}>
      <label className={cn("text-sm font-light text-text-secondary", labelClassName)}>{label}</label>
      {children}
    </div>
  );
}
