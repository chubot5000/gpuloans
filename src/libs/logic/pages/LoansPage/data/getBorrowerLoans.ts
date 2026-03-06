"use server";

import { getDeposits } from "data/loanRouterSubgraph";
import { getLoanTermsByBorrower, getNftMetadata, LoanTerms } from "data/supabase";
import { getUnixTime } from "date-fns";
import { compact, groupBy } from "lodash";
import { tokenIdsFromRange } from "logic/utils";
import { Address, isAddressEqual } from "viem";

import { getLoanTermsOnchainData } from "./getLoanTermsOnchainData";
import { Loan, LoanStatus } from "./types";

export async function getBorrowerLoans(borrower: Address) {
  const loanTerms = await getLoanTermsByBorrower(borrower);

  const [onchainDataResults, nftMetadata] = await Promise.all([
    Promise.allSettled(loanTerms.map(getLoanTermsOnchainData)),
    getAllNFTMetadata(loanTerms),
  ]);

  const loans = compact(
    loanTerms.map((loanTerms, index) => {
      /* skip if onchain data failed */
      if (onchainDataResults[index].status == "rejected") return undefined;

      /* skip if NFTs aren't owned by borrower while loan is pending */
      const onchainData = onchainDataResults[index].value;
      if (!onchainData.nfts.isOwned && onchainData.loanState.status == LoanStatus.Uninitialized) return undefined;

      const principal = loanTerms.trancheSpecs.reduce((acc, tranche) => acc + tranche.amount, 0n);
      const weightedRate = loanTerms.trancheSpecs.reduce((acc, tranche) => acc + tranche.rate * tranche.amount, 0n);
      const blendedRate = weightedRate / principal;

      /* construct loan object */
      const { nfts, ...rest } = onchainData;
      const loan = {
        ...loanTerms,
        principal,
        blendedRate,
        ...rest,
        nfts: { ...nfts, metadata: {} },
      } as Loan;

      /* fill in NFT metadata */
      for (const tokenId of nfts.tokenIds) {
        const nft = nftMetadata.find(
          (m) => m.id == tokenId.toString() && isAddressEqual(m.collection, loanTerms.erc721),
        );
        loan.nfts.metadata[tokenId.toString()] = nft;

        loan.nfts.metadata.totalCollateralValueUSD =
          (loan.nfts.metadata.totalCollateralValueUSD ?? 0) + (nft?.metadata.collateralValueUSD ?? 0);
      }

      return loan;
    }),
  );

  const deposits = await getSubgraphData(loans);

  /* make sure uninitialized loans are deposit ready */
  return loans.filter((loan) => {
    if (loan.loanState.status !== LoanStatus.Uninitialized) return true;

    /* each tranche must have a valid deposit */
    return loan.trancheSpecs.every((tranche) => {
      const deposit = deposits.find(
        (d) => d.context == loan.loanTermsHash && isAddressEqual(d.depositor, tranche.lender),
      );
      if (!deposit) return false;

      const hasNotExpired = deposit.expiration > getUnixTime(new Date()) + 10 * 60;
      const hasEnoughBalance = deposit.amount >= tranche.amount;

      return hasNotExpired && hasEnoughBalance;
    });
  });
}

async function getAllNFTMetadata(terms: LoanTerms[]) {
  const idsByCollection: Record<Address, Set<string>> = {};

  for (const term of terms) {
    const { erc721, startTokenId, endTokenId } = term;

    /* initialize range if not already set */
    idsByCollection[erc721] ||= new Set();

    /* update range if a smaller start token id is found */
    tokenIdsFromRange([startTokenId, endTokenId]).forEach((tokenId) => {
      idsByCollection[erc721].add(tokenId.toString());
    });
  }

  return (
    await Promise.all(
      Object.entries(idsByCollection).map(async ([collection, ids]) => {
        return getNftMetadata({ collection: collection as Address, ids: Array.from(ids) });
      }),
    )
  ).flat();
}

async function getSubgraphData(loans: Loan[]) {
  const loansByChain = groupBy(loans, "chain");

  return (
    await Promise.all(
      Object.keys(loansByChain).map(async (chainId) => {
        return getDeposits({
          chainId: Number(chainId),
          contexts: loansByChain[chainId].map((l) => l.loanTermsHash),
        });
      }),
    )
  ).flat();
}
