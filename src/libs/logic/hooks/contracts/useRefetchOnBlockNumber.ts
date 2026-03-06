import { useQueryClient } from "@tanstack/react-query";
import type { Chain } from "viem";
import { arbitrum, base, blast, mainnet, sepolia } from "viem/chains";
import { useWatchBlockNumber } from "wagmi";

const l1PollingInterval = 8_000;
const l2PollingInterval = 8_000;

export const POLLING_INTERVALS: Record<Chain["id"], number> = {
  [mainnet.id]: l1PollingInterval,
  [blast.id]: l2PollingInterval,
  [base.id]: l2PollingInterval,
  [arbitrum.id]: l2PollingInterval,
  [sepolia.id]: l1PollingInterval,
};

interface Params {
  enabled: boolean;
  chainId: number;
  queryKeyToInvalidate: readonly unknown[];
}

export function useRefetchOnBlockNumber(params: Params) {
  const { enabled, chainId, queryKeyToInvalidate } = params;

  const queryClient = useQueryClient();

  useWatchBlockNumber({
    chainId,
    enabled,
    pollingInterval: POLLING_INTERVALS[chainId],
    onBlockNumber: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeyToInvalidate });
    },
  });
}
