import { AmountTooltip } from "ui/components";

import { UILoanStatus } from "../../LoanStatusTag";
import { Row } from "../components";

import { useLoanPayment } from "./LoanPaymentProvider";

export function MonthlyPayment() {
  const { isPrepayment, uiLoanStatus, quote, loan } = useLoanPayment();

  if (isPrepayment && uiLoanStatus == UILoanStatus.Current)
    return <Row label="Applied to Monthly Payment" value="$0" />;

  return (
    <div className="flex flex-col gap-3">
      <Row
        label={isPrepayment ? "Applied to Monthly Payment" : "Monthly Payment"}
        value={<AmountTooltip amount={quote.principal + quote.interest} decimals={loan.erc20.decimals} />}
      />
      <Row
        label="Principal"
        value={<AmountTooltip amount={quote.principal} decimals={loan.erc20.decimals} />}
        className="ml-2 text-text-secondary"
      />
      <Row
        label="Interest"
        value={<AmountTooltip amount={quote.interest} decimals={loan.erc20.decimals} />}
        className="ml-2 text-text-secondary"
      />
    </div>
  );
}
