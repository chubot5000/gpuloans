"use client";

import { useCopyToClipboard } from "logic/hooks";
import { cn } from "logic/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { ReactNode } from "react";

interface ErrorFallbackProps {
  error: unknown;
  className?: string;
  showCopyButton?: boolean;
  message?: ReactNode;
  hideError?: boolean;
}

export function ErrorFallback(props: ErrorFallbackProps) {
  const { error, message, hideError = false, showCopyButton = false, className } = props;
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div className={cn("flex items-center flex-col gap-1 justify-center", className)}>
      {message ? message : <span className="text-sm text-secondary">Something went wrong</span>}
      {error instanceof Error && !hideError && <span className="text-sm text-secondary">({error.message})</span>}
      {showCopyButton && error instanceof Error && (
        <button className="text-sm text-secondary" onClick={() => copy(error.message)}>
          {isCopied ? <CopyCheckIcon className="size-4 shrink-0" /> : <CopyIcon className="size-4 shrink-0" />}
        </button>
      )}
    </div>
  );
}
