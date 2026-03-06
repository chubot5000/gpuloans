import { useQuery } from "@tanstack/react-query";
import { getPaymentHistory } from "data/loanRouterSubgraph";

import { Loan } from "./data";

export function usePaymentHistory(loan: Loan) {
  return useQuery({
    queryKey: ["paymentHistory", loan.id] as const,
    queryFn: async () => {
      return await getPaymentHistory({
        chainId: loan.chain,
        loanTermsHash: loan.loanTermsHash,
        repaymentInterval: loan.repaymentInterval,
      });
    },
  });
}
