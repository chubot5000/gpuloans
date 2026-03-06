import { createPublicClient, http } from "viem";
import { arbitrum, arbitrumSepolia, mainnet, plasma, sepolia } from "viem/chains";

import { getEnvChainById } from "./chains";

const ALCHEMY_API_KEY = process.env["ALCHEMY_API_KEY"];

function getUrl(chainName: string) {
  return `https://${chainName}.g.alchemy.com/v2/${ALCHEMY_API_KEY}`;
}

export const RPC_URLS: Record<number, ReturnType<typeof getUrl>> = {
  [arbitrum.id]: getUrl("arb-mainnet"),
  [mainnet.id]: getUrl("eth-mainnet"),
  [plasma.id]: getUrl("plasma-mainnet"),
  /* testnets */
  [sepolia.id]: getUrl("eth-sepolia"),
  [arbitrumSepolia.id]: getUrl("arb-sepolia"),
};

export function rpcClient(chainId: number) {
  const chain = getEnvChainById(chainId);
  if (!chain) throw new Error(`Chain ${chainId} not supported`);
  return createPublicClient({ chain, transport: http(RPC_URLS[chain.id]) });
}
