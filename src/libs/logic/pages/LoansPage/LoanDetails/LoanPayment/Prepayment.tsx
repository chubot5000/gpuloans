import { fromUnits } from "logic/utils";
import { AmountTooltip, Input } from "ui/components";

import { calcPaymentSchedule } from "../../PaymentSchedule/calcPaymentSchedule";
import { Row } from "../components";

import { useLoanPayment } from "./LoanPaymentProvider";
import { MonthlyPayment } from "./MonthlyPayment";

export function Prepayment() {
  const {
    loan,
    customPaymentAmount,
    setCustomPaymentAmount,
    customPaymentAmountUnits,
    quote,
    loanTimestamps,
    maxToRepay,
    customPaymentAmountError,
  } = useLoanPayment();

  let prepaymentAmount = customPaymentAmountUnits;
  let totalPrincipalReduced = customPaymentAmountUnits;

  if (loanTimestamps.isRepayment) {
    prepaymentAmount -= quote.total;
    if (prepaymentAmount < 0) prepaymentAmount = 0n;

    totalPrincipalReduced -= quote.interest;
    if (totalPrincipalReduced < 0) totalPrincipalReduced = 0n;
  }

  let futureInterestSavings = 0n;
  if (prepaymentAmount) {
    const currentSchedule = calcPaymentSchedule(loan);

    const newSchedule = calcPaymentSchedule({
      ...loan,
      loanState: { ...loan.loanState, scaledBalance: loan.principal - prepaymentAmount },
    });

    futureInterestSavings = currentSchedule.totalInterest - newSchedule.totalInterest;
  }

  const willFullyRepay = customPaymentAmountUnits >= maxToRepay;

  const isDisabled = loanTimestamps.isGracePeriod;

  return (
    <>
      <div className="flex flex-col gap-2 mb-5">
        <div className="flex items-center justify-between ">
          <span className="text-text-secondary">Enter amount</span>

          {!isDisabled ? (
            <button
              type="button"
              onClick={() =>
                setCustomPaymentAmount(fromUnits(maxToRepay, loan.erc20.decimals).toFixed(loan.erc20.decimals))
              }
              className="text-text-secondary text-xs"
            >
              MAX
            </button>
          ) : null}
        </div>

        <Input
          type="number"
          onChange={setCustomPaymentAmount}
          value={customPaymentAmount}
          inputClassName="text-end"
          error={customPaymentAmountError && true}
          disabled={isDisabled}
        />
        <div className="h-6">
          <span className="text-red-500 text-xs">{customPaymentAmountError}</span>
        </div>
      </div>

      <MonthlyPayment />

      <Row
        label="Prepayment of Principal"
        value={<AmountTooltip amount={prepaymentAmount} decimals={loan.erc20.decimals} />}
        className="mt-4"
      />

      <div className="flex flex-col border-t border-b gap-2 mt-4 py-3">
        <Row
          label="Total Principal Reduced"
          value={<AmountTooltip amount={totalPrincipalReduced} decimals={loan.erc20.decimals} />}
          className="text-text-secondary"
        />

        <Row
          label="Future Interest Savings"
          value={<AmountTooltip amount={futureInterestSavings} decimals={loan.erc20.decimals} />}
          className="text-text-secondary text-xs"
        />
      </div>

      {willFullyRepay && loan.exitFee ? (
        <Row
          label="Exit Fee"
          value={<AmountTooltip amount={loan.exitFee} decimals={loan.erc20.decimals} />}
          className="text-secondary py-4 border-b"
        />
      ) : null}
    </>
  );
}
