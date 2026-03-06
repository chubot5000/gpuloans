"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AdminProvider, SidebarProvider, Web3Provider } from "logic/components";
import { DevtoolsProvider } from "logic/components/Devtools";
import { _DEFAULT_CONFIG } from "logic/utils";
import { type ReactNode } from "react";
import { TooltipProvider } from "ui/components";
import { Toaster } from "ui/components";

import { DevTools } from "./DevTools";

interface AppProvidersProps {
  children: ReactNode;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: _DEFAULT_CONFIG.refetchOnWindowFocus,
    },
  },
});

export const wagmiConfig = undefined as unknown as Record<string, unknown>;

export function AppProviders(props: AppProvidersProps) {
  const { children } = props;

  return (
    <QueryClientProvider client={queryClient}>
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

      <Toaster />
      <DevTools />
    </QueryClientProvider>
  );
}
