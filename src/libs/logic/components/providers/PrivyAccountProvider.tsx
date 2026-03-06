"use client";

import { createContext, type ReactNode, useContext } from "react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PrivyAccountContext = createContext<any>(undefined);

export function usePrivyAccount() {
  const context = useContext(PrivyAccountContext);
  if (!context) throw new Error("usePrivyAccount must be used within a PrivyAccountProvider");
  return context;
}

interface Props {
  children: ReactNode;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
}

export function PrivyAccountProvider(props: Props) {
  const { children, user } = props;

  const state = {
    user,
    authenticated: false,
    ready: true,
    canUnlink: false,
    linkEmail: () => {},
    login: () => {},
    logout: async () => {},
  };

  return <PrivyAccountContext.Provider value={state}>{children}</PrivyAccountContext.Provider>;
}
