"use client";

import { usePrivy } from "@privy-io/react-auth";
import { getEnvChainById } from "data/rpc";
import { useDevtools } from "logic/components/Devtools";
import { useIsMounted, usePrivyUserMetadata } from "logic/hooks";
import { createContext, type PropsWithChildren, useContext, useEffect } from "react";
import { http, type Address, createPublicClient, createWalletClient } from "viem";
import { arbitrum } from "viem/chains";
import { createConnector, useChains, useConnect, useConnection } from "wagmi";

export const SIGNER_CONNECTOR_ID = "SIGNER_CONNECTOR";
export const createCustomConnector = (accounts: Address[], chainId: number) => {
  return createConnector((config) => {
    return {
      id: SIGNER_CONNECTOR_ID,
      name: "Signer Connector",
      type: "wallet",
      disconnect: async () => {
        config.emitter.emit("disconnect");
      },
      onDisconnect: async () => {
        config.emitter.emit("disconnect");
      },
      onConnect: async () => {
        config.emitter.emit("connect", {
          accounts: accounts,
          chainId: chainId,
        });
      },
      async connect({ withCapabilities } = {}) {
        config.emitter.emit("connect", {
          accounts,
          chainId: chainId,
        });

        return {
          accounts: (withCapabilities ? accounts.map((address) => ({ address, capabilities: {} })) : accounts) as never,
          chainId: chainId,
        };
      },
      getAccounts: async () => {
        return accounts;
      },
      getChainId: async () => {
        return chainId;
      },
      getProvider: async () => {
        const publicClient = createPublicClient({
          transport: http("/api/rpc", { fetchOptions: { headers: { chainid: `${chainId}` } } }),
          chain: getEnvChainById(chainId),
          name: "Additional Signer",
        });

        return publicClient;
      },
      getClient: async () => {
        const walletClient = createWalletClient({
          account: accounts[0],
          transport: http("/api/rpc", { fetchOptions: { headers: { chainid: `${chainId}` } } }),
          chain: getEnvChainById(chainId),
          name: "Additional Signer",
        });

        return walletClient;
      },
      isAuthorized: async () => {
        return true;
      },
      onAccountsChanged: async (accounts: Address[]) => {
        config.emitter.emit("change", { accounts });
      },
      onChainChanged: async (chainId: string) => {
        config.emitter.emit("change", { chainId: parseInt(chainId) });
      },
      switchChain: async ({ chainId }) => {
        config.emitter.emit("change", { chainId: chainId });
        const chain = getEnvChainById(chainId);
        if (!chain) throw new Error(`Chain ${chainId} not supported`);
        return chain;
      },
    };
  });
};

function useWeb3State() {
  const isMounted = useIsMounted();
  const { authenticated, user, ready } = usePrivy();
  const userMetadata = usePrivyUserMetadata();

  const { impersonatedAddress } = useDevtools();

  const { address: activeAddress, chain: activeChain, ...accountRest } = useConnection();
  const { mutate: connect } = useConnect();

  useEffect(() => {
    if (!ready || !authenticated || !userMetadata) return;
    if (userMetadata.linkedWallets.length === 0) return;
    if (accountRest.isConnected || accountRest.isConnecting) return;

    const accounts = userMetadata.linkedWallets.map((w) => w.address);
    const connector = createCustomConnector([accounts[0]], arbitrum.id);
    connect({ connector });
  }, [ready, authenticated, userMetadata, connect, accountRest.isConnected, accountRest.isConnecting]);

  const chains = useChains();
  const chain = activeChain ?? chains[0];

  let address: Address | undefined;
  if (isMounted) {
    if (authenticated) {
      const firstLinkedWallet = user?.linkedAccounts.find((a) => a.type == "wallet")?.address as Address | undefined;
      address = activeAddress ?? firstLinkedWallet;
    }
  }

  if (impersonatedAddress) address = impersonatedAddress;

  const isAdditionalSigner = Boolean(userMetadata?.linkedWallets.find((w) => w.address === address));

  return {
    account: {
      ...accountRest,
      chain: activeChain,
      address,
      ready,
    },
    address,
    chain,
    chainId: chain.id,
    isAdditionalSigner,
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
