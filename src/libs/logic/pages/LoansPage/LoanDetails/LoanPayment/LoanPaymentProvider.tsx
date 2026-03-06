import { useSearchParamsMutation } from "logic/hooks";
import { fromInput, scaleDown, toUnits } from "logic/utils";
import { createContext, ReactNode, useContext, useState } from "react";

import { Loan } from "../../data";
import { useUILoanStatus } from "../../LoanStatusTag";
import { useLoanTimestamps } from "../../useLoanTimestamp";
import { useRepayInfo } from "../../useRepayInfo";

type Params = {
  loan: Loan;
  resetState: () => void;
};

function useLoanPaymentState(params: Params) {
  const { loan, resetState } = params;

  const loanTimestamps = useLoanTimestamps(loan, 10_000);
  const uiLoanStatus = useUILoanStatus(loan);

  const {
    data: quote = {
      principal: 0n,
      interest: 0n,
      fees: 0n,
      total: 0n,
      willFullyRepay: false,
      gracePeriodPayment: 0n,
    },
  } = useRepayInfo(loan, loanTimestamps.isRepayment);

  const sp = useSearchParamsMutation();
  const isPrepayment = sp.get("action") == "prepayment";
  function setIsPrepayment(value: boolean) {
    sp.set("action", value ? "prepayment" : undefined);
  }

  const [customPaymentAmount, setCustomPaymentAmount] = useState("");
  const customPaymentAmountUnits = toUnits(fromInput(customPaymentAmount), loan.erc20.decimals);

  const remainingBalance = scaleDown(loan.loanState.scaledBalance, loan.erc20.decimals);
  const maxToRepay = quote.total > remainingBalance ? quote.total : remainingBalance + quote.interest;

  const customPaymentAmountError = !customPaymentAmount
    ? undefined
    : !loanTimestamps.isRepayment
      ? customPaymentAmountUnits <= 0n
        ? "Must be greater than 0"
        : customPaymentAmountUnits > maxToRepay
          ? "Custom payment amount must be less than the remaining principal"
          : undefined
      : customPaymentAmountUnits < quote.total
        ? "Custom payment amount must be greater than the total amount due"
        : customPaymentAmountUnits > maxToRepay
          ? "Custom payment amount must be less than the remaining principal"
          : undefined;

  return {
    loan,
    loanTimestamps,
    uiLoanStatus,
    quote,
    isPrepayment,
    setIsPrepayment,
    customPaymentAmount,
    setCustomPaymentAmount,
    customPaymentAmountUnits,
    customPaymentAmountError,
    maxToRepay,
    resetState,
  };
}

const LoanPaymentContext = createContext<ReturnType<typeof useLoanPaymentState> | undefined>(undefined);

export function useLoanPayment() {
  const context = useContext(LoanPaymentContext);
  if (!context) throw new Error("useLoanPayment must be used within a LoanPaymentProvider");
  return context;
}

type Props = Params & {
  children: ReactNode;
};

export function LoanPaymentProvider(props: Props) {
  const { children, ...params } = props;

  const state = useLoanPaymentState(params);

  return <LoanPaymentContext.Provider value={state}>{children}</LoanPaymentContext.Provider>;
}
