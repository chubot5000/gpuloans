"use client";

import type { ReactNode } from "react";
import type { Chain } from "viem";

export function createWagmiConfig(_chains: [Chain, ...Chain[]]) {
  return undefined as unknown as Record<string, unknown>;
}

export interface WagmiProviderProps {
  children: ReactNode;
  config: ReturnType<typeof createWagmiConfig>;
}

export function WagmiProvider({ children }: WagmiProviderProps) {
  return <>{children}</>;
}
