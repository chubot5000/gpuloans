"use client";

import { useDevtools } from "logic/components/Devtools";
import { createContext, type PropsWithChildren, useContext } from "react";
import { type Address } from "viem";
import { arbitrum } from "viem/chains";

export const SIGNER_CONNECTOR_ID = "SIGNER_CONNECTOR";

function useWeb3State() {
  const { impersonatedAddress } = useDevtools();

  const chain = arbitrum;
  let address: Address | undefined;

  if (impersonatedAddress) address = impersonatedAddress;

  return {
    account: {
      chain: undefined,
      address,
      ready: true,
      isConnected: false,
      isConnecting: false,
      isDisconnected: true,
      isReconnecting: false,
      status: "disconnected" as const,
    },
    address,
    chain,
    chainId: chain.id,
    isAdditionalSigner: false,
  };
}

const Web3Context = createContext<ReturnType<typeof useWeb3State> | undefined>(undefined);

export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) throw new Error("useWeb3 must be used within a Web3Provider");
  return context;
}

export function Web3Provider(props: PropsWithChildren) {
  const state = useWeb3State();

  return <Web3Context.Provider value={state}>{props.children}</Web3Context.Provider>;
}
