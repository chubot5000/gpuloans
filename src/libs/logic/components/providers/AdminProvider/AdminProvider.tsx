"use client";

import { usePrivy } from "@privy-io/react-auth";
import { useQuery } from "@tanstack/react-query";
import { getAdmins } from "data/fetchers";
import { createContext, type PropsWithChildren, useCallback, useContext, useEffect, useState } from "react";

function useAdminState() {
  const [adminModeOverride, setAdminModeOverride] = useState<boolean | null>(null);
  const { user } = usePrivy();
  const { data: admins } = useQuery({
    queryKey: ["admins"],
    queryFn: () => getAdmins(),
  });

  const isAdmin = Boolean(admins?.includes(user?.email?.address?.toLowerCase() ?? ""));

  const isAdminMode = adminModeOverride ?? isAdmin;

  const toggleAdminMode = useCallback(() => {
    setAdminModeOverride((prev) => !(prev ?? isAdmin));
  }, [isAdmin]);

  const setIsAdminMode = useCallback((value: boolean) => {
    setAdminModeOverride(value);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (!isAdmin) return;
      if (event.ctrlKey && event.metaKey && event.key === "A") {
        toggleAdminMode();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isAdmin, toggleAdminMode]);

  return {
    isAdmin,
    isAdminMode,
    toggleAdminMode,
    setIsAdminMode,
  };
}

const AdminContext = createContext<ReturnType<typeof useAdminState> | undefined>(undefined);

export function useAdmin() {
  const context = useContext(AdminContext);
  if (!context) throw new Error("useAdmin must be used within an AdminProvider");
  return context;
}

export function AdminProvider(props: PropsWithChildren) {
  const state = useAdminState();

  return <AdminContext.Provider value={state}>{props.children}</AdminContext.Provider>;
}
