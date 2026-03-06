import { getUnixTime } from "date-fns";
import { useEffect, useState } from "react";

import { Loan } from "./data";

export function useLoanTimestamps(loan: Loan, intervalMs = 1_000) {
  const calculateTimestamps = (loan: Loan) => {
    const now = getUnixTime(new Date());
    const isRepayment = now > loan.loanState.repaymentDeadline - loan.repaymentInterval;
    const remainingUntilRepaymentDeadLine = loan.loanState.repaymentDeadline - now;
    const isGracePeriod = remainingUntilRepaymentDeadLine <= 0;
    return { isRepayment, isGracePeriod, remainingUntilRepaymentDeadLine };
  };

  const [timestamps, setTimestamps] = useState(calculateTimestamps(loan));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimestamps(calculateTimestamps(loan));
    }, intervalMs);

    return () => clearInterval(interval);
  }, [loan, intervalMs]);

  return timestamps;
}
