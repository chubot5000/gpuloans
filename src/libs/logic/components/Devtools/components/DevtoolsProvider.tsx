"use client";

import { createContext, type ReactNode, useContext, useEffect, useState } from "react";
import type { Address } from "viem";

function useDevtoolsState() {
  const [isDevtoolsEnabled] = useState(true);
  const [isDevtoolsOpen, setIsDevtoolsOpen] = useState(false);
  const [isImpersonatorOpen, setIsImpersonatorOpen] = useState(false);
  const [impersonatedAddress, setImpersonatedAddress] = useState<Address | undefined>(undefined);

  const [isAppConfigOpen, setIsAppConfigOpen] = useState(false);

  const isDevtoolsInUse = Boolean(impersonatedAddress || isDevtoolsEnabled);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.shiftKey && event.ctrlKey) {
        if (event.key === "E") {
          setIsImpersonatorOpen((prev) => !prev);
        } else if (event.key === "C") {
          setIsDevtoolsOpen((prev) => !prev);
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return {
    isDevtoolsInUse,
    isDevtoolsOpen,
    setIsDevtoolsOpen,
    isImpersonatorOpen,
    setIsImpersonatorOpen,
    impersonatedAddress,
    setImpersonatedAddress,
    isAppConfigOpen,
    setIsAppConfigOpen,
  };
}

type DevtoolsContextType = ReturnType<typeof useDevtoolsState>;

const DevtoolsContext = createContext<DevtoolsContextType | undefined>(undefined);

export function useDevtools() {
  const context = useContext(DevtoolsContext);
  if (!context) throw new Error("useDevtools must be called within a DevtoolsProvider");
  return context;
}

interface DevtoolsProviderProps {
  children: ReactNode;
}

export function DevtoolsProvider(props: DevtoolsProviderProps) {
  const { children } = props;

  const state = useDevtoolsState();

  return <DevtoolsContext.Provider value={state}>{children}</DevtoolsContext.Provider>;
}
