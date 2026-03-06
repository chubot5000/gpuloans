import type { Chain } from "viem";
import { arbitrum, arbitrumSepolia, base, mainnet, plasma, sepolia } from "viem/chains";

import { chainSlugs } from "./chainsMetadata";

function getChainsFromEnv(envChainSlugs: string | undefined): [Chain, ...Chain[]] {
  if (!envChainSlugs) return [arbitrum, plasma, mainnet];

  const chains: Chain[] = [];
  envChainSlugs.split(",").forEach((slug) => {
    const chain = getChainBySlug(slug);
    if (chain) chains.push(chain);
  });

  if (!chains.length) throw new Error("Chains is empty");
  return chains as [Chain, ...Chain[]];
}

export const envChains = getChainsFromEnv(process.env["NEXT_PUBLIC_NETWORKS"]);

export function getChainBySlug(slug: string) {
  if (slug == chainSlugs.mainnet) return mainnet;

  if (slug == chainSlugs.base) return base;

  if (slug == chainSlugs.arbitrum) return arbitrum;

  if (slug == chainSlugs.sepolia) return sepolia;

  if (slug == chainSlugs.arbitrumSepolia) return arbitrumSepolia;

  if (slug == chainSlugs.plasma) return plasma;

  return null;
}

export function getEnvChainById(id: number) {
  return envChains.find((chain) => chain.id === id);
}
