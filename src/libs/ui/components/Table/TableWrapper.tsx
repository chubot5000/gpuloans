import { cn } from "logic/utils";
import type { ReactNode } from "react";

interface TableWrapperProps {
  children: ReactNode;
  className?: string;
}

export function TableWrapper({ children, className }: TableWrapperProps) {
  return <div className={cn("w-full overflow-hidden", className)}>{children}</div>;
}
