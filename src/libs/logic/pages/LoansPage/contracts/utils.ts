import { LoanTerms } from "data/supabase";
import { tokenIdsFromRange } from "logic/utils";
import { Address, encodePacked, fromHex, keccak256 } from "viem";

import { Loan } from "../data";

import { LOAN_ADDRESSES } from "./addresses";

type ComputeBundleParams = {
  chainId: number;
  collection: Address;
  startTokenId: bigint;
  endTokenId: bigint;
};

export function computeBundle(params: ComputeBundleParams) {
  const { chainId, startTokenId, endTokenId, collection } = params;

  const { bundleCW } = LOAN_ADDRESSES[chainId];

  let collateralWrapperContext = encodePacked(["address"], [collection]);
  tokenIdsFromRange([startTokenId, endTokenId]).forEach((id) => {
    collateralWrapperContext = encodePacked(["bytes", "uint256"], [collateralWrapperContext, BigInt(id)]);
  });

  const collateralTokenId = fromHex(
    keccak256(encodePacked(["uint", "bytes"], [BigInt(chainId), collateralWrapperContext])),
    "bigint",
  );

  return { collateralToken: bundleCW, collateralTokenId, collateralWrapperContext };
}

export function loanToAbiTerms(loan: Loan | LoanTerms) {
  const currencyToken = typeof loan.erc20 == "string" ? loan.erc20 : loan.erc20.address;
  const isSingleToken = loan.startTokenId === loan.endTokenId && !loan.metadata.forceBundle;

  let collateralToken: Address;
  let collateralTokenId: bigint;
  let collateralWrapperContext: `0x${string}`;

  if (isSingleToken) {
    collateralToken = loan.erc721;
    collateralTokenId = BigInt(loan.startTokenId);
    collateralWrapperContext = "0x";
  } else {
    ({ collateralToken, collateralTokenId, collateralWrapperContext } = computeBundle({
      chainId: loan.chain,
      startTokenId: loan.startTokenId,
      endTokenId: loan.endTokenId,
      collection: loan.erc721,
    }));
  }

  return {
    expiration: BigInt(loan.expiration),
    borrower: loan.borrower,
    currencyToken,
    collateralToken,
    collateralTokenId,
    duration: BigInt(loan.duration),
    repaymentInterval: BigInt(loan.repaymentInterval),
    interestRateModel: loan.interestRateModel,
    gracePeriodRate: BigInt(loan.gracePeriodRate),
    gracePeriodDuration: BigInt(loan.gracePeriodDuration),
    feeSpec: {
      originationFee: BigInt(loan.originationFee),
      exitFee: BigInt(loan.exitFee),
    },
    trancheSpecs: loan.trancheSpecs.map((tranche) => ({
      lender: tranche.lender,
      amount: BigInt(tranche.amount),
      rate: BigInt(tranche.rate),
    })),
    collateralWrapperContext,
    options: "0x",
  } as const;
}
