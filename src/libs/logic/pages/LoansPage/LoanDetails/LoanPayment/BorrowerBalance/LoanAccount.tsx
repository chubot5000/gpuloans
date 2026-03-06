import { useCopyToClipboard } from "logic/hooks";
import { cn, truncateAddress } from "logic/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { Address } from "viem";

export function LoanAccount({ borrower, className }: { borrower: Address; className?: string }) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-xs font-medium">LOAN ACCOUNT</span>
      <button type="button" onClick={() => copy(borrower)} className="flex items-center gap-1 outline-none">
        <span className="text-xs text-text-dark-secondary">{truncateAddress(borrower)}</span>
        {isCopied ? (
          <CopyCheckIcon className="size-3 shrink-0 text-text-disabled" />
        ) : (
          <CopyIcon className="size-3 text-text-disabled shrink-0" />
        )}
      </button>
    </div>
  );
}
