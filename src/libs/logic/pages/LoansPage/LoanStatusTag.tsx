import { cn } from "logic/utils";

import { Loan, LoanStatus } from "./data";
import { useLoanTimestamps } from "./useLoanTimestamp";

export enum UILoanStatus {
  Pending = "Pending",
  Current = "Current",
  PayNow = "Pay Now",
  Late = "Late",
  Closed = "Closed",
  AtAuction = "At Auction",
  Auctioned = "Auctioned",
}

export function useUILoanStatus(loan: Loan) {
  const { isGracePeriod, isRepayment } = useLoanTimestamps(loan, 10_000);

  const status = loan.loanState.status;

  if (status == LoanStatus.Uninitialized) return UILoanStatus.Pending;
  if (status == LoanStatus.Repaid) return UILoanStatus.Closed;
  if (status == LoanStatus.Liquidated) return UILoanStatus.AtAuction;
  if (status == LoanStatus.CollateralLiquidated) return UILoanStatus.Auctioned;
  if (!isRepayment) return UILoanStatus.Current;
  if (!isGracePeriod) return UILoanStatus.PayNow;
  return UILoanStatus.Late;
}

type Props = {
  loan: Loan;
  className?: string;
};

export function LoanStatusTag(props: Props) {
  const uiLoanStatus = useUILoanStatus(props.loan);

  return (
    <div
      className={cn(
        "flex items-center justify-center text-center border min-w-20 px-3 h-6",
        {
          "border-secondary text-secondary": uiLoanStatus == UILoanStatus.Pending,
          "border-status-green-500 text-status-green-500": uiLoanStatus == UILoanStatus.Current,
          "border-status-green-500 bg-status-green-500 text-white": uiLoanStatus == UILoanStatus.Closed,
          "border-blue-400 text-blue-400": uiLoanStatus == UILoanStatus.PayNow,
          "border-status-red-500 bg-status-red-500 text-white": uiLoanStatus == UILoanStatus.Late,
          "border-primary bg-primary text-white": uiLoanStatus == UILoanStatus.AtAuction,
          "border-primary text-primary": uiLoanStatus == UILoanStatus.Auctioned,
        },
        props.className,
      )}
    >
      {uiLoanStatus}
    </div>
  );
}
