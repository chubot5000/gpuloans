import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";

import { LOAN_ADDRESSES, LOAN_ROUTER_ABI, loanToAbiTerms } from "./contracts";
import { Loan } from "./data";

export function useRepayInfo(loan: Loan, isRepayment: boolean) {
  const pClient = usePublicClient({ chainId: loan.chain });

  return useQuery({
    queryKey: ["quote", loan.loanTermsHash, isRepayment] as const,
    queryFn: async ({ queryKey }) => {
      const [, , isRepayment] = queryKey;

      if (!pClient) throw new Error("No public client");

      const loanRouter = LOAN_ADDRESSES[loan.chain].loanRouter;

      const [quoteNow, quoteAtRepaymentDeadline] = await pClient.multicall({
        contracts: [
          /* quote now */
          {
            address: loanRouter,
            abi: LOAN_ROUTER_ABI,
            functionName: "quote",
            args: [loanToAbiTerms(loan)],
          },
          /* quote at repayment deadline */
          {
            address: loanRouter,
            abi: LOAN_ROUTER_ABI,
            functionName: "quote",
            args: [loanToAbiTerms(loan), BigInt(loan.loanState.repaymentDeadline)],
          },
        ],
        allowFailure: false,
      });

      if (isRepayment) {
        return {
          principal: quoteNow[0],
          interest: quoteNow[1],
          fees: quoteNow[2],
          total: quoteNow[0] + quoteNow[1] + quoteNow[2],
          gracePeriodPayment: quoteNow[1] - quoteAtRepaymentDeadline[1],
        };
      }

      return {
        principal: quoteAtRepaymentDeadline[0],
        interest: quoteAtRepaymentDeadline[1],
        fees: quoteAtRepaymentDeadline[2],
        total: quoteAtRepaymentDeadline[0] + quoteAtRepaymentDeadline[1] + quoteAtRepaymentDeadline[2],
        gracePeriodPayment: 0n,
      };
    },
    enabled: Boolean(pClient),
  });
}
