import { cn } from "logic/utils";
import type { ReactNode } from "react";

interface Props {
  variant: "green" | "red" | "blue";
  children: ReactNode;
  className?: string;
}

export function StatusTag(props: Props) {
  const { variant, children, className } = props;

  return (
    <div
      className={cn(
        "px-3 py-0.5 text-sm flex items-center gap-1",
        { "bg-status-green-50 text-status-green-500 dark:bg-teal-950": variant == "green" },
        { "bg-status-red-50 text-status-red-500 dark:bg-red-950": variant == "red" },
        { "bg-blue-50 text-blue-500 dark:bg-blue-950": variant == "blue" },
        className,
      )}
    >
      {children}
    </div>
  );
}

type LoanStatusTagProps = {
  isRepayment: boolean;
  isGracePeriod: boolean;
};

export function LoanStatusTag(props: LoanStatusTagProps) {
  const { isGracePeriod, isRepayment } = props;

  return (
    <StatusTag
      className="flex items-center gap-1 text-right whitespace-nowrap"
      variant={isGracePeriod ? "red" : isRepayment ? "blue" : "green"}
    >
      <div
        className={cn(
          "size-1.5",
          isGracePeriod ? "bg-status-red-500" : isRepayment ? "bg-blue-500" : "bg-status-green-500",
        )}
      />
      {isGracePeriod ? "Grace Period" : isRepayment ? "Make Payment" : "Current"}
    </StatusTag>
  );
}
