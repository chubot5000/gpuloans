import { getUnixTime } from "date-fns";
import { scaleDown } from "logic/utils";

import { Loan, LoanStatus } from "../data";

const FIXED_POINT_SCALE = 1e18;

export function calcSimplePaymentSchedule(loan: Loan) {
  const { duration, repaymentInterval, blendedRate, loanState } = loan;

  const loanDurationBN = BigInt(duration);
  const repaymentIntervalBN = BigInt(repaymentInterval);

  let balanceBN: bigint;
  let remainingRepaymentIntervals: number;
  let startTimestamp: number;

  if (loanState.status == LoanStatus.Uninitialized) {
    balanceBN = loan.principal;
    remainingRepaymentIntervals = Number(loanDurationBN / repaymentIntervalBN);
    startTimestamp = getUnixTime(new Date());
  } else {
    balanceBN = scaleDown(loanState.scaledBalance, loan.erc20.decimals);
    remainingRepaymentIntervals =
      Math.floor((loanState.maturity - loanState.repaymentDeadline) / repaymentInterval) + 1;
    startTimestamp = loanState.maturity - remainingRepaymentIntervals * repaymentInterval;
  }

  if (remainingRepaymentIntervals == 0) {
    return {
      totalIntervals: 0,
      principalPerInterval: 0,
      repayments: [],
      totalPrincipal: 0n,
      totalInterest: 0n,
      startTimestamp,
    };
  }

  // Calculate principal payment per interval
  const principalPaymentPerInterval = balanceBN / BigInt(remainingRepaymentIntervals);
  const principalRemainder = balanceBN % BigInt(remainingRepaymentIntervals);

  // Calculate repayment for each interval
  const repayments = [];
  let remainingBalance = balanceBN;
  let totalPrincipal = 0n;
  let totalInterest = 0n;

  for (let i = 0; i < remainingRepaymentIntervals; i++) {
    // Calculate interest payment
    const interestPayment = (remainingBalance * blendedRate * repaymentIntervalBN) / BigInt(FIXED_POINT_SCALE);

    // For the last interval, add any remainder to ensure balance goes to 0
    const isLastInterval = i === remainingRepaymentIntervals - 1;
    const principalPayment = isLastInterval
      ? principalPaymentPerInterval + principalRemainder
      : principalPaymentPerInterval;

    // Total repayment for this interval = principal + interest
    const totalRepayment = principalPayment + interestPayment;

    // Update remaining balance after this payment
    remainingBalance -= principalPayment;
    totalPrincipal += principalPayment;
    totalInterest += interestPayment;

    repayments.push({
      interval: i + 1,
      principal: principalPayment,
      interest: interestPayment,
      total: totalRepayment,
      remainingBalance,
    });
  }

  return {
    totalIntervals: remainingRepaymentIntervals,
    principalPerInterval: principalPaymentPerInterval,
    repayments,
    totalPrincipal,
    totalInterest,
    startTimestamp,
  };
}
