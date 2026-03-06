"use client";

import { useWeb3 } from "logic/components";
import { Loan } from "logic/pages/LoansPage/data";
import { useLoansPage } from "logic/pages/LoansPage/LoansPageProvider";

import { CHAINS_PEER, TOKENS_PEER } from "../WithdrawModal/LzUtils";

import { ChainBalance } from "./ChainBalance";
import { LoanAccount } from "./LoanAccount";
import { ReserveAcct } from "./ReserveAcct";

export function BorrowerBalance({ loan }: { loan: Loan }) {
  const { erc20: token, chain: chainId, borrower } = loan;
  const { setIsWithdrawModalOpen } = useLoansPage();
  const peerChainId = CHAINS_PEER[chainId];
  const peerTokenAddress = TOKENS_PEER[token.address];
  const { isAdditionalSigner } = useWeb3();

  if (!isAdditionalSigner) return null;

  return (
    <div className={"flex flex-col border border-outline-major"}>
      {/* Row 1: LOAN ACCOUNT + RESERVE ACCT */}
      <div className="flex items-center gap-4 bg-bg-primary border-b border-outline-minor px-3.5 py-1">
        <LoanAccount className="flex-wrap gap-x-2 gap-y-1" borrower={borrower} />
        <div className="w-px h-4 bg-outline-minor" />
        <ReserveAcct chainId={chainId} borrower={borrower} />
      </div>

      {/* Row 2: Balances + Withdraw */}
      <div className="flex items-center gap-4 px-3.5 py-1">
        <div className="flex md:items-center gap-2 max-md:flex-col">
          <span className="text-xs font-medium text-text-dark-secondary whitespace-nowrap">
            {token.symbol} BALANCES
          </span>
          <div className="flex items-center gap-4">
            <ChainBalance
              chainId={chainId}
              tokenAddress={token.address}
              borrower={borrower}
              decimals={token.decimals}
            />
            <ChainBalance
              chainId={peerChainId}
              tokenAddress={peerTokenAddress}
              borrower={borrower}
              decimals={token.decimals}
            />
          </div>
        </div>
        <button type="button" onClick={() => setIsWithdrawModalOpen(true)} className="btn-xs btn-primary ml-auto px-8">
          Withdraw
        </button>
      </div>
    </div>
  );
}
