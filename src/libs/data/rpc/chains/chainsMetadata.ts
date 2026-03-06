import type { Chain } from "viem";
import { arbitrum, arbitrumSepolia, base, mainnet, plasma, plasmaTestnet, sepolia } from "viem/chains";

/** Explicit display order for chains */
export const CHAIN_DISPLAY_ORDER: number[] = [arbitrum.id, plasma.id, base.id];

export interface ChainMetadata {
  viemChain: Chain;
  slug: string;
  name: string;
  logoUrl: string;
  symbol: string;
  color: string;
  explorerUrl: string;
  isTestnet?: boolean;
}

export const chainSlugs = {
  mainnet: "mainnet",
  base: "base",
  arbitrum: "arbitrum",
  plasma: "plasma",
  /* testnets*/
  sepolia: "sepolia",
  arbitrumSepolia: "arbitrum-sepolia",
  plasmaTestnet: "plasma-testnet",
};

function getLogoUrl(chainSlug: string) {
  return `/svg/chain-logos/${chainSlug}.svg`;
}

export const chainsMetadata: Record<number, ChainMetadata> = {
  [mainnet.id]: {
    viemChain: mainnet,
    slug: chainSlugs.mainnet,
    name: "Ethereum",
    symbol: "ETH",
    color: "#fff",
    logoUrl: getLogoUrl(chainSlugs.mainnet),
    explorerUrl: mainnet.blockExplorers.default.url,
  },
  [base.id]: {
    viemChain: base,
    slug: chainSlugs.base,
    name: "Base",
    symbol: "BASE",
    color: "#fff",
    logoUrl: getLogoUrl(chainSlugs.base),
    explorerUrl: base.blockExplorers.default.url,
  },
  [arbitrum.id]: {
    viemChain: arbitrum,
    slug: chainSlugs.arbitrum,
    name: "Arbitrum",
    symbol: "ARB",
    color: "#91D1F8",
    logoUrl: getLogoUrl(chainSlugs.arbitrum),
    explorerUrl: arbitrum.blockExplorers.default.url,
  },
  [plasma.id]: {
    viemChain: plasma,
    slug: chainSlugs.plasma,
    name: "Plasma",
    symbol: "PLASMA",
    color: "#fff",
    logoUrl: getLogoUrl(chainSlugs.plasma),
    explorerUrl: plasma.blockExplorers.default.url,
  },
  /* testnets */
  [sepolia.id]: {
    viemChain: sepolia,
    slug: chainSlugs.sepolia,
    name: "Sepolia",
    logoUrl: getLogoUrl(chainSlugs.mainnet),
    symbol: "SEP",
    color: "#fff",
    explorerUrl: sepolia.blockExplorers.default.url,
    isTestnet: true,
  },
  [arbitrumSepolia.id]: {
    viemChain: arbitrumSepolia,
    slug: chainSlugs.arbitrumSepolia,
    name: "Arbitrum Sepolia",
    logoUrl: getLogoUrl(chainSlugs.arbitrum),
    symbol: "ARBSEP",
    color: "#91D1F8",
    explorerUrl: arbitrumSepolia.blockExplorers.default.url,
    isTestnet: true,
  },
  [plasmaTestnet.id]: {
    viemChain: plasmaTestnet,
    slug: chainSlugs.plasmaTestnet,
    name: "Testnet Plasma",
    logoUrl: getLogoUrl(chainSlugs.plasma),
    symbol: "PLASMASEP",
    color: "#fff",
    explorerUrl: plasmaTestnet.blockExplorers.default.url,
    isTestnet: true,
  },
};
