"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";
import { WagmiProvider as _WagmiProvider, createConfig } from "@privy-io/wagmi";
import type { ReactNode } from "react";
import type { Chain, Transport } from "viem";
import { cookieStorage, createStorage, http } from "wagmi";

export function createWagmiConfig(chains: [Chain, ...Chain[]]) {
  const transports: Record<number, Transport> = {};
  chains.forEach((chain) => {
    transports[chain.id] = http("/api/rpc", {
      fetchOptions: { headers: { chainid: `${chain.id}` } },
    });
  });

  return createConfig({
    chains,
    transports,
    ssr: true,
    storage: createStorage({
      storage: cookieStorage,
    }),
  });
}

export interface WagmiProviderProps {
  children: ReactNode;
  config: ReturnType<typeof createWagmiConfig>;
}

export function WagmiProvider({ children, config }: WagmiProviderProps) {
  const appId = process.env["NEXT_PUBLIC_PRIVY_APP_ID"];

  // Skip Privy/Wagmi providers when no valid app ID is configured
  if (!appId || appId === "placeholder") {
    return <>{children}</>;
  }

  return (
    <PrivyProvider
      appId={appId}
      config={{
        appearance: {
          theme: "light",
          accentColor: "#CCAE95",
          logo: "/svg/gpu-loans-logo.svg",
          walletChainType: "ethereum-only",
          walletList: [
            "detected_ethereum_wallets",
            "metamask",
            "rabby_wallet",
            "wallet_connect",
            "okx_wallet",
            "binance",
            "coinbase_wallet",
          ],
        },
      }}
    >
      <SmartWalletsProvider>
        <_WagmiProvider config={config}>{children}</_WagmiProvider>
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
