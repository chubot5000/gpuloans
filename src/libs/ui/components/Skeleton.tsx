import { cn } from "logic/utils";

interface SkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

export function Skeleton({ className = "", children }: SkeletonProps) {
  return (
    <span className={cn("flex w-fit animate-pulse rounded-sm bg-stone-200", className)}>
      <span className="opacity-0">{children}</span>
    </span>
  );
}
