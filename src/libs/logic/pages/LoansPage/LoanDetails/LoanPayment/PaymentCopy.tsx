import { ReactNode } from "react";

import { UILoanStatus } from "../../LoanStatusTag";

import { useLoanPayment } from "./LoanPaymentProvider";

export function PaymentCopy() {
  const { uiLoanStatus, isPrepayment } = useLoanPayment();
  let paragraph: ReactNode;

  const Prepayment = <span className="text-primary">Prepayment</span>;
  const PayNow = <span className="text-blue-500 whitespace-nowrap">Pay Now</span>;
  const Current = <span className="text-status-green-500">Current</span>;
  const Late = <span className="text-status-red-500">Late</span>;

  if (uiLoanStatus == UILoanStatus.PayNow) {
    if (isPrepayment) {
      paragraph = (
        <>
          Your {PayNow} amount will be paid off first and the balance of {Prepayment} will be applied towards Principal
          reduction. {Prepayment} must always be greater than {PayNow} amount.
        </>
      );
    } else {
      paragraph = (
        <>
          Want to pay more towards your principal? Click {Prepayment} above to prepay principal in addition to your
          monthly payment.
        </>
      );
    }
  } else if (uiLoanStatus == UILoanStatus.Current) {
    if (isPrepayment) {
      paragraph = (
        <>
          If you are {Current}, you can make a {Prepayment} in any amount and as frequently as you wish.
        </>
      );
    } else {
      paragraph = (
        <>
          {Current} loans must wait until the next period before another monthly payment can be made. Click {Prepayment}{" "}
          above to prepay principal.
        </>
      );
    }
  } else if (uiLoanStatus == UILoanStatus.Late) {
    if (isPrepayment) {
      paragraph = (
        <>
          A {Late} payment must be made first before a {Prepayment} can be made.
        </>
      );
    } else {
      paragraph = (
        <>
          A {Late} payment must be made first before a {Current} monthly payment can be made.
        </>
      );
    }
  } else {
    throw new Error(`Unsupported UI loan status: ${uiLoanStatus}`);
  }

  return <p className="text-text-secondary py-4">{paragraph}</p>;
}
