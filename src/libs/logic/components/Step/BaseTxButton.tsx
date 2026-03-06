import { cn } from "logic/utils";
import type { ReactNode } from "react";
import { Button } from "ui/components";

interface BaseTxButtonProps {
  onClick: (() => void) | undefined;
  isDone: boolean;
  onDone: () => void;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export function BaseTxButton(props: BaseTxButtonProps) {
  const { className, disabled, isLoading, children, onDone, onClick, isDone } = props;

  if (isDone) {
    return (
      <Button className={cn("btn-large h-12 btn-secondary", className)} onClick={onDone}>
        Done
      </Button>
    );
  }

  return (
    <Button className={cn("btn-large h-12", className)} disabled={disabled} isLoading={isLoading} onClick={onClick}>
      {children}
    </Button>
  );
}
