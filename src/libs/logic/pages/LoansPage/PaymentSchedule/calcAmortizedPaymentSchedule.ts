import { Loan, LoanStatus } from "../data";

const FIXED_POINT_SCALE = BigInt(1e18);

/**
 * Fixed-point exponentiation: base^n where base is scaled by 1e18.
 * Uses iterative multiplication to match the Solidity _powInt implementation exactly.
 * (NOT binary exponentiation — must match contract rounding behavior)
 */
function powInt(x: bigint, n: number): bigint {
  if (n === 0) return FIXED_POINT_SCALE;
  if (x === 0n) return 0n;
  if (n === 1) return x;

  let result = x;
  for (let i = 1; i < n; i++) {
    result = (result * x) / FIXED_POINT_SCALE;
  }
  return result;
}

/**
 * Fixed-point mulDiv: (a * b) / c — matches OZ Math.mulDiv for bigint.
 */
function mulDiv(a: bigint, b: bigint, c: bigint): bigint {
  return (a * b) / c;
}

/**
 * Calculates the amortized payment schedule for a loan.
 *
 * Matches the on-chain AmortizedInterestRateModel.sol logic exactly:
 *   interestPayment  = remainingBalance * blendedRate * repaymentInterval / SCALE
 *   principalPayment = interestPayment * SCALE / (powInt(1 + r, M) - SCALE)
 *   where r = blendedRate * repaymentInterval, M = remaining intervals
 *
 * Each interval recomputes M (decremented), so principal increases and interest
 * decreases over time while the total payment stays approximately constant.
 */
export function calcAmortizedPaymentSchedule(loan: Loan) {
  const { duration, repaymentInterval, blendedRate, loanState } = loan;

  const loanDurationBN = BigInt(duration);
  const repaymentIntervalBN = BigInt(repaymentInterval);

  let balanceBN: bigint;
  let remainingRepaymentIntervals: number;
  let startTimestamp: number;

  if (loanState.status === LoanStatus.Uninitialized) {
    balanceBN = loan.principal;
    remainingRepaymentIntervals = Number(loanDurationBN / repaymentIntervalBN);
    startTimestamp = Math.floor(Date.now() / 1000);
  } else {
    balanceBN = loanState.scaledBalance / BigInt(10 ** loan.erc20.decimals);
    remainingRepaymentIntervals =
      Math.floor((loanState.maturity - loanState.repaymentDeadline) / repaymentInterval) + 1;
    startTimestamp = loanState.maturity - remainingRepaymentIntervals * repaymentInterval;
  }

  if (remainingRepaymentIntervals === 0) {
    return {
      totalIntervals: 0,
      principalPerInterval: 0n,
      repayments: [],
      totalPrincipal: 0n,
      totalInterest: 0n,
      startTimestamp,
    };
  }

  // Rate per interval in fixed-point (1e18 scale)
  const ratePerInterval = blendedRate * repaymentIntervalBN;

  // Handle zero interest rate — just equal principal payments
  if (ratePerInterval === 0n) {
    const principalPerInterval = balanceBN / BigInt(remainingRepaymentIntervals);
    const principalRemainder = balanceBN % BigInt(remainingRepaymentIntervals);
    const repayments = [];
    let remainingBalance = balanceBN;
    let totalPrincipal = 0n;

    for (let i = 0; i < remainingRepaymentIntervals; i++) {
      const isLast = i === remainingRepaymentIntervals - 1;
      const principalPayment = isLast ? principalPerInterval + principalRemainder : principalPerInterval;
      remainingBalance -= principalPayment;
      totalPrincipal += principalPayment;

      repayments.push({
        interval: i + 1,
        principal: principalPayment,
        interest: 0n,
        total: principalPayment,
        remainingBalance,
      });
    }

    return {
      totalIntervals: remainingRepaymentIntervals,
      principalPerInterval,
      repayments,
      totalPrincipal,
      totalInterest: 0n,
      startTimestamp,
    };
  }

  const onePlusR = FIXED_POINT_SCALE + ratePerInterval;

  // Build the schedule — matching contract loop exactly
  const repayments = [];
  let remainingBalance = balanceBN;
  let totalPrincipal = 0n;
  let totalInterest = 0n;
  let remaining = remainingRepaymentIntervals;

  for (let i = 0; i < remainingRepaymentIntervals; i++) {
    // Interest payment: remainingBalance * blendedRate * repaymentInterval / SCALE
    // Matches: Math.mulDiv(remainingBalance * blendedInterestRate, terms.repaymentInterval, FIXED_POINT_SCALE)
    const interestPayment = mulDiv(remainingBalance * blendedRate, repaymentIntervalBN, FIXED_POINT_SCALE);

    // Principal payment: interest / ((1 + r)^M - 1)  OR  remainingBalance if last interval
    // Matches contract lines 136-144
    let principalPayment: bigint;
    if (remaining === 1) {
      principalPayment = remainingBalance;
    } else {
      principalPayment = mulDiv(interestPayment, FIXED_POINT_SCALE, powInt(onePlusR, remaining) - FIXED_POINT_SCALE);
    }

    const totalRepayment = principalPayment + interestPayment;

    remainingBalance -= principalPayment;
    totalPrincipal += principalPayment;
    totalInterest += interestPayment;
    remaining--;

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
    principalPerInterval: repayments[0]?.principal ?? 0n,
    repayments,
    totalPrincipal,
    totalInterest,
    startTimestamp,
  };
}
