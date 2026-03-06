"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { envChains } from "data/rpc";
import { AdminProvider, SidebarProvider, Web3Provider } from "logic/components";
import { DevtoolsProvider } from "logic/components/Devtools";
import { _DEFAULT_CONFIG } from "logic/utils";
import { type ReactNode } from "react";
import { TooltipProvider } from "ui/components";
import { Toaster } from "ui/components";
import { hashFn } from "wagmi/query";

import { DevTools } from "./DevTools";
import { createWagmiConfig, WagmiProvider } from "./WagmiProvider";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryKeyHashFn: hashFn,
      refetchOnWindowFocus: _DEFAULT_CONFIG.refetchOnWindowFocus,
    },
  },
});

export const wagmiConfig = createWagmiConfig(envChains);

export function AppProviders(props: AppProvidersProps) {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <AdminProvider>
          <SidebarProvider>
            <DevtoolsProvider>
              <Web3Provider>
                <TooltipProvider delayDuration={100} skipDelayDuration={0}>
                  {children}
                </TooltipProvider>
              </Web3Provider>
            </DevtoolsProvider>
          </SidebarProvider>
        </AdminProvider>
      </WagmiProvider>

      <Toaster />
      <DevTools />
    </QueryClientProvider>
  );
}
