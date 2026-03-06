"use client";

import { useAccountDeals } from "logic/hooks";
import { type ReactNode, useContext, createContext } from "react";

export function useApplicationsState() {
  const { activeDeals, personName, isLoading } = useAccountDeals();

  return {
    activeDeals,
    personName,
    isLoading,
  };
}

const ApplicationsContext = createContext<ReturnType<typeof useApplicationsState> | undefined>(undefined);

export function useApplications() {
  const context = useContext(ApplicationsContext);
  if (!context) throw new Error("useApplications must be used within ApplicationsPageProvider");

  return context;
}

interface ApplicationsPageProviderProps {
  children: ReactNode;
}

export function ApplicationsPageProvider(props: ApplicationsPageProviderProps) {
  const { children } = props;
  const state = useApplicationsState();

  return <ApplicationsContext.Provider value={state}>{children}</ApplicationsContext.Provider>;
}
