import { LoanTerms, NftMetadata } from "data/supabase";
import { Address, Hash } from "viem";

export type Loan = Omit<LoanTerms, "erc20"> & {
  principal: bigint;
  blendedRate: bigint;
  nfts: LoanNFTsWithMetadata;
  erc20: ERC20;
  loanTermsHash: Hash;
  loanState: LoanOnchainState;
};

type Metadata = Record<string, NftMetadata | undefined> & { totalCollateralValueUSD: number };
export type LoanNFTsWithMetadata = LoanOnchainNFTs<true> & { metadata: Metadata };

export type LoanOnchainNFTs<Owned extends boolean = boolean> = {
  collection: Address;
  tokenIds: bigint[];
  bundle: {
    collection: Address;
    tokenId: bigint;
    context: Hash;
  };
  isOwned: Owned;
  isBundled: boolean;
};

export enum LoanStatus {
  Uninitialized,
  Active,
  Repaid,
  Liquidated,
  CollateralLiquidated,
}

export type LoanOnchainState = {
  status: LoanStatus;
  maturity: number;
  repaymentDeadline: number;
  scaledBalance: bigint;
};

export type ERC20 = {
  address: Address;
  symbol: string;
  decimals: number;
};
