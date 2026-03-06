"use client";

import { createContext, useContext, useState } from "react";

function useSidebarState() {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);

  return {
    isSidebarExpanded,
    setIsSidebarExpanded,
  };
}

type SidebarContextType = ReturnType<typeof useSidebarState>;

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const state = useSidebarState();

  return <SidebarContext.Provider value={state}>{children}</SidebarContext.Provider>;
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a SidebarProvider");

  return context;
};
