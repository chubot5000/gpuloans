"use client";

import { createContext, type PropsWithChildren, useCallback, useContext, useState } from "react";

function useAdminState() {
  const [adminModeOverride, setAdminModeOverride] = useState<boolean | null>(null);

  const isAdmin = false;
  const isAdminMode = adminModeOverride ?? isAdmin;

  const toggleAdminMode = useCallback(() => {
    setAdminModeOverride((prev) => !(prev ?? isAdmin));
  }, [isAdmin]);

  const setIsAdminMode = useCallback((value: boolean) => {
    setAdminModeOverride(value);
  }, []);

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
