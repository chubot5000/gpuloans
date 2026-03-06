"use client";

import { usePrivy } from "@privy-io/react-auth";

import { ConnectedWalletButton } from "./ConnectedWalletButton";

export function WalletButton() {
  const { authenticated } = usePrivy();

  if (authenticated) return <ConnectedWalletButton />;

  return null;
}
