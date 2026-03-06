"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

function useLoansPageState() {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);

  return {
    isWithdrawModalOpen,
    setIsWithdrawModalOpen,
    isBridgeModalOpen,
    setIsBridgeModalOpen,
  };
}

type LoansPageContextType = ReturnType<typeof useLoansPageState>;

const LoansPageContext = createContext<LoansPageContextType | undefined>(undefined);

export function useLoansPage() {
  const context = useContext(LoansPageContext);
  if (!context) throw new Error("useLoansPage must be called within a LoansPageProvider");
  return context;
}

interface LoansPageProviderProps {
  children: ReactNode;
}

export function LoansPageProvider(props: LoansPageProviderProps) {
  const { children } = props;

  const state = useLoansPageState();

  return <LoansPageContext.Provider value={state}>{children}</LoansPageContext.Provider>;
}
