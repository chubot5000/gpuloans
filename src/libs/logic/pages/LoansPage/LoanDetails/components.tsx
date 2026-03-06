import { cn } from "logic/utils";
import { ReactNode } from "react";

type CellProps = {
  children: ReactNode;
  className?: string;
};

export function Cell(props: CellProps) {
  const { children, className } = props;
  return <div className={cn("flex bg-white py-4 px-8", className)}>{children}</div>;
}

type RowProps = {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
};

export function Row(props: RowProps) {
  const { label, value, className, labelClassName, valueClassName } = props;

  return (
    <div className={cn("flex items-center justify-between text-sm", className)}>
      <span className={cn("text-text-secondary", labelClassName)}>{label}</span>
      <span className={cn("font-medium text-end", valueClassName)}>{value}</span>
    </div>
  );
}
