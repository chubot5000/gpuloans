import { CalendarIcon } from "@heroicons/react/24/outline";
import { Step } from "logic/components";
import { useCopyToClipboard } from "logic/hooks";
import {
  denormalizeRate,
  formatDate,
  formatDuration,
  formatTimeRemaining,
  fromUnits,
  printPercent2FD,
} from "logic/utils";
import { useReducer } from "react";
import { AmountTooltip, Button, Tooltip } from "ui/components";

import { Loan } from "../../data";
import { LoanStatusTag } from "../../LoanStatusTag";
import { useBorrowerLoans } from "../../useBorrowerLoans";
import { usePaymentHistory } from "../../usePaymentHistory";
import { useRepayTx } from "../../useRepayTx";
import { Cell, Row } from "../components";
import { PaymentHistory } from "../PaymentHistory";

import { LoanPaymentProvider, useLoanPayment } from "./LoanPaymentProvider";
import { Payment } from "./Payment";
import { PaymentCopy } from "./PaymentCopy";
import { Prepayment } from "./Prepayment";

type Props = {
  loan: Loan;
};

export function LoanPayment(props: Props) {
  const { loan } = props;

  const [key, resetState] = useReducer((key) => key + 1, 0);

  return (
    <LoanPaymentProvider loan={loan} resetState={resetState} key={key}>
      <LoanPayment_ />
    </LoanPaymentProvider>
  );
}

export function LoanPayment_() {
  const {
    loan,
    resetState,
    quote,
    loanTimestamps,
    isPrepayment,
    setIsPrepayment,
    customPaymentAmountUnits,
    customPaymentAmountError,
  } = useLoanPayment();
  const { isRepayment, remainingUntilRepaymentDeadLine } = loanTimestamps;

  const { refetch: refetchBorrowerLoans, isRefetching: isRefetchingBorrowerLoans } = useBorrowerLoans();
  const { refetch: refetchPaymentHistory } = usePaymentHistory(loan);

  const { action, steps, currentStepIndex, isBalanceInsufficient } = useRepayTx(
    loan,
    isPrepayment ? customPaymentAmountUnits : undefined,
  );
  const currentStep = steps[currentStepIndex];

  const isDone = steps.at(-1)?.status == "confirmed";
  async function afterDone() {
    await Promise.all([refetchPaymentHistory(), refetchBorrowerLoans()]);
    resetState();
  }

  const isLoading = isDone
    ? isRefetchingBorrowerLoans
    : currentStep.status == "sending" || currentStep.status == "confirming";

  let isDisabled;
  if (isPrepayment) isDisabled = loanTimestamps.isGracePeriod || Boolean(customPaymentAmountError);
  else if (!isRepayment) isDisabled = true;
  else isDisabled = false;
  isDisabled = isDisabled || isBalanceInsufficient;

  return (
    <div className="flex flex-col w-full gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col bg-brown-900 px-5 py-4 xl:py-6 text-white justify-center">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <CalendarIcon className="size-4 inline" />
                <span className="font-normal">Next Payment</span>
              </div>
              <LoanStatusTag loan={loan} />
            </div>

            <NextRepaymentAmount amount={quote.total} decimals={loan.erc20.decimals} />

            <div className="flex items-center gap-2">
              <span>Due on</span>{" "}
              <span className="text-primary-light">{formatDate(loan.loanState.repaymentDeadline)}</span>{" "}
              <span className="bg-white/20 py-1 px-2">{formatTimeRemaining(remainingUntilRepaymentDeadLine)}</span>
            </div>
          </div>

          <div className="flex flex-col border border-outline-major px-5 py-4">
            <span className="text-primary font-medium mb-5">Current Loan Overview</span>

            <div className="flex flex-col divide-y [&>div]:py-4">
              <Row
                label="Original Principal"
                value={<AmountTooltip amount={loan.principal} decimals={loan.erc20.decimals} />}
              />

              <Row
                label="Remaining Principal"
                value={<AmountTooltip amount={loan.loanState.scaledBalance} decimals={18} />}
              />

              <Row label="APR" value={printPercent2FD(denormalizeRate(loan.blendedRate))} />

              <Row label="Maturity Date" value={formatDate(loan.loanState.maturity)} />

              <Row
                label="Default Grace Period (APR)"
                value={
                  <>
                    {formatDuration(loan.gracePeriodDuration)} (
                    {printPercent2FD(denormalizeRate(loan.blendedRate + loan.gracePeriodRate))})
                  </>
                }
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col col-span-1 xl:col-span-2 border border-outline-major gap-px bg-outline-major">
          <Cell className="gap-2 col-span-full h-20">
            <Button className={isPrepayment ? "btn-tertiary" : "btn-primary"} onClick={() => setIsPrepayment(false)}>
              Monthly Payment
            </Button>
            <Button className={isPrepayment ? "btn-primary" : "btn-tertiary"} onClick={() => setIsPrepayment(true)}>
              Prepayment
            </Button>
          </Cell>

          <div className="grid grid-cols-1 xl:grid-cols-2 justify-stretch grow gap-px">
            <Cell className="flex-col">
              {isPrepayment ? <Prepayment /> : <Payment />}

              <PaymentCopy />
            </Cell>

            <div className="flex flex-col gap-px col-span-2 lg:col-span-1">
              <Cell className="h-[3.75rem] items-center">
                <span className="text-text-secondary font-base">Transaction Details</span>
              </Cell>

              <Cell className="flex-col grow">
                {steps.map((step, index) => (
                  <Step key={index} step={step} index={index} currentStepIndex={currentStepIndex} />
                ))}
              </Cell>

              <Button
                className="btn-large"
                isLoading={isLoading}
                onClick={isDone ? afterDone : action.send}
                disabled={isDone ? false : isDisabled || !action.send}
              >
                {isDone
                  ? "Done"
                  : isBalanceInsufficient
                    ? "Insufficient Balance"
                    : isPrepayment
                      ? "Prepay"
                      : !isRepayment
                        ? "Loan is Current"
                        : currentStep.action}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <PaymentHistory loan={loan} />
    </div>
  );
}

function NextRepaymentAmount({ amount, decimals }: { amount: bigint; decimals: number }) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <Tooltip
      side="left"
      tooltipText="Copied!"
      trigger={
        <button onClick={() => copy(fromUnits(amount, decimals).toString())}>
          <AmountTooltip className="my-4.5 text-4xl cursor-pointer" amount={amount} decimals={decimals} />
        </button>
      }
      isOpen={isCopied}
    />
  );
}
