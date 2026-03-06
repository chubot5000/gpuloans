import { LOAN_ADDRESSES } from "logic/pages/LoansPage/contracts";
import { Address } from "viem";

import { ChainBalance } from "./ChainBalance";

export function ReserveAcct({ chainId, borrower }: { chainId: number; borrower: Address }) {
  const usdaiAddress = LOAN_ADDRESSES[chainId].usdai;

  return (
    <div className="flex items-center gap-x-4 gap-y-1 flex-wrap">
      <span className="text-xs font-medium text-fill-primary">RESERVE ACCT</span>
      <ChainBalance
        className="text-fill-secondary"
        tokenMetadata={{ symbol: "USDai", logoUrl: "/svg/erc20/usdai.svg" }}
        chainId={chainId}
        tokenAddress={usdaiAddress}
        borrower={borrower}
        decimals={18}
      />
    </div>
  );
}
