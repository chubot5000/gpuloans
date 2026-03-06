import { cn } from "logic/utils";

import { Loan, LoanStatus } from "../data/types";

import { ActiveLoansSection } from "./ActiveLoansSection";
import { InactiveLoansSection } from "./InactiveLoansSection";

type Props = {
  loans: Loan[];
  className?: string;
};

export function LoansList(props: Props) {
  const { loans, className } = props;

  const activeLoans: Loan[] = [];
  const inactiveLoans: Loan[] = [];

  for (const loan of loans) {
    if (loan.loanState.status == LoanStatus.Active || loan.loanState.status == LoanStatus.Uninitialized) {
      activeLoans.push(loan);
    } else {
      inactiveLoans.push(loan);
    }
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <ActiveLoansSection loans={activeLoans} />
      <InactiveLoansSection loans={inactiveLoans} />
    </div>
  );
}
