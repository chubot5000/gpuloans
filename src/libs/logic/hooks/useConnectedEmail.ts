"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

export function useConnectedEmail() {
  const { user } = usePrivy();

  const email = useMemo(() => {
    const emailAccount = user?.linkedAccounts.find((account) => account.type === "email");
    return emailAccount && "address" in emailAccount ? emailAccount.address : undefined;
  }, [user]);

  return email;
}
