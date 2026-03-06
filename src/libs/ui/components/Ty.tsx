import { cn } from "logic/utils";
import { ReactNode } from "react";

import { Skeleton } from "./Skeleton";

interface TyProps {
  className?: string;
  stateLess?: boolean;
  value: ReactNode;
}

export function Ty(props: TyProps) {
  const { className, stateLess = false, value } = props;

  if (!stateLess) {
    if (value === null) return "--";
    if (value === undefined) return <Skeleton className={cn("w-full h-4", className)} />;
  }

  if (typeof value === "string") {
    return <span className={className}>{value}</span>;
  }

  return <div className={className}>{value}</div>;
}
