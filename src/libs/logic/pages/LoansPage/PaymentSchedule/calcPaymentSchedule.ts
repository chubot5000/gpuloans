import { isAddressEqual } from "viem";

import { LOAN_ADDRESSES } from "../contracts/addresses";
import { Loan } from "../data";

import { calcAmortizedPaymentSchedule } from "./calcAmortizedPaymentSchedule";
import { calcSimplePaymentSchedule } from "./calcSimplePaymentSchedule";

export function calcPaymentSchedule(loan: Loan) {
  const isAmortized = isAddressEqual(loan.interestRateModel, LOAN_ADDRESSES[loan.chain].amortizedInterestRateModel);
  if (isAmortized) return calcAmortizedPaymentSchedule(loan);
  return calcSimplePaymentSchedule(loan);
}
