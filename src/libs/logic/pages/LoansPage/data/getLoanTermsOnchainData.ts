"use server";

import { rpcClient } from "data/rpc";
import { LoanTerms } from "data/supabase";
import { tokenIdsFromRange } from "logic/utils";
import { Address, erc20Abi, erc721Abi, Hash, isAddressEqual } from "viem";

import { computeBundle, LOAN_ADDRESSES, LOAN_ROUTER_ABI, loanToAbiTerms } from "../contracts";

import { LoanOnchainNFTs, LoanOnchainState, LoanStatus } from "./types";

export async function getLoanTermsOnchainData(terms: LoanTerms) {
  const { chain, borrower } = terms;

  const bundle = computeBundle({
    chainId: chain,
    collection: terms.erc721,
    startTokenId: terms.startTokenId,
    endTokenId: terms.endTokenId,
  });

  const nfts: LoanOnchainNFTs = {
    collection: terms.erc721,
    tokenIds: tokenIdsFromRange([terms.startTokenId, terms.endTokenId]),
    bundle: {
      collection: bundle.collateralToken,
      tokenId: bundle.collateralTokenId,
      context: bundle.collateralWrapperContext,
    },
    isOwned: false,
    isBundled: false,
  };

  const client = rpcClient(chain);

  const contacts = [
    /* Loan terms hash */
    {
      address: LOAN_ADDRESSES[chain].loanRouter,
      abi: LOAN_ROUTER_ABI,
      functionName: "loanTermsHash",
      args: [loanToAbiTerms(terms)],
    },
    /* Bundle owner */
    {
      address: bundle.collateralToken,
      abi: erc721Abi,
      functionName: "ownerOf",
      args: [bundle.collateralTokenId],
    },
    /* ERC20 */
    {
      address: terms.erc20,
      abi: erc20Abi,
      functionName: "decimals",
    },
    {
      address: terms.erc20,
      abi: erc20Abi,
      functionName: "symbol",
    },
    /* Underlying token owners */
    ...nfts.tokenIds.map(
      (tokenId) =>
        ({
          address: terms.erc721,
          abi: erc721Abi,
          functionName: "ownerOf",
          args: [tokenId],
        }) as const,
    ),
  ];

  const [
    loanTermsHashResult, //
    bundleOwner,
    erc20Decimals,
    erc20Symbol,
    ...tokenOwners
  ] = await client.multicall({ contracts: contacts, allowFailure: true });

  // should never happen
  if (tokenOwners.length != nfts.tokenIds.length) throw new Error("Check tokenOwners destructuring");

  if (!loanTermsHashResult.result) throw new Error("Failed to get loan terms hash");
  const loanTermsHash = loanTermsHashResult.result as Hash;

  const _loanState = await client.readContract({
    address: LOAN_ADDRESSES[chain].loanRouter,
    abi: LOAN_ROUTER_ABI,
    functionName: "loanState",
    args: [loanTermsHash],
  });
  const loanState: LoanOnchainState = {
    status: _loanState[0] as LoanStatus,
    maturity: Number(_loanState[1]),
    repaymentDeadline: Number(_loanState[2]),
    scaledBalance: _loanState[3],
  };

  if (bundleOwner.status == "success" && isAddressEqual(bundleOwner.result as Address, borrower)) {
    nfts.isOwned = true;
    nfts.isBundled = true;
  } else if (tokenOwners.every((t) => t.status == "success" && isAddressEqual(t.result as Address, borrower))) {
    nfts.isOwned = true;
  }

  if (erc20Decimals.status != "success" || erc20Symbol.status != "success") {
    throw new Error("Failed to get ERC20 data");
  }

  const erc20 = {
    address: terms.erc20,
    decimals: erc20Decimals.result as number,
    symbol: erc20Symbol.result as string,
  };

  return { loanTermsHash, loanState, nfts, erc20 };
}
