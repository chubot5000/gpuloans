import { cn, formatDate } from "logic/utils";
import { AmountTooltip } from "ui/components";

import { Row } from "../components";

import { useLoanPayment } from "./LoanPaymentProvider";
import { MonthlyPayment } from "./MonthlyPayment";

export function Payment() {
  const { loan, quote } = useLoanPayment();

  return (
    <>
      <span className="text-primary font-medium mb-5 text-base">Monthly Payment Overview</span>

      <MonthlyPayment />

      <div className="flex flex-col border-t border-b py-3 mt-4">
        <Row
          label="Default Grace Period Interest"
          value={<AmountTooltip amount={quote.gracePeriodPayment} decimals={loan.erc20.decimals} />}
          className={cn({
            "[&>span]:text-secondary": !quote.gracePeriodPayment,
            "[&>span]:text-status-red-500": quote.gracePeriodPayment,
          })}
        />

        {quote.fees ? (
          <Row
            label="Exit Fee"
            value={<AmountTooltip amount={quote.fees} decimals={loan.erc20.decimals} />}
            className="text-secondary"
          />
        ) : null}
      </div>

      <Row
        label={`Total Due on ${formatDate(loan.loanState.repaymentDeadline)}`}
        value={<AmountTooltip amount={quote.total} decimals={loan.erc20.decimals} />}
        className="borer-b py-4"
      />
    </>
  );
}
