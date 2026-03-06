"use client";

import { useLinkAccount, usePrivy, type User } from "@privy-io/react-auth";
import { sendWelcomeEmail } from "logic/data";
import { createContext, type ReactNode, useContext } from "react";

function usePrivyAccountState(user: User) {
  const privy = usePrivy();

  const { linkEmail } = useLinkAccount({
    onSuccess: async ({ linkedAccount }) => {
      if (linkedAccount.type == "email") {
        await sendWelcomeEmail(linkedAccount.address).catch((error) => {
          console.error(JSON.stringify(error, null, 2));
        });
      }
    },
  });

  return { ...privy, user, canUnlink: user.linkedAccounts.length > 1, linkEmail };
}

const PrivyAccountContext = createContext<ReturnType<typeof usePrivyAccountState> | undefined>(undefined);

export function usePrivyAccount() {
  const context = useContext(PrivyAccountContext);
  if (!context) throw new Error("usePrivyAccount must be used within a PrivyAccountProvider");
  return context;
}

interface Props {
  children: ReactNode;
  user: User;
}

export function PrivyAccountProvider(props: Props) {
  const { children, user } = props;

  const state = usePrivyAccountState(user);

  return <PrivyAccountContext.Provider value={state}>{children}</PrivyAccountContext.Provider>;
}
