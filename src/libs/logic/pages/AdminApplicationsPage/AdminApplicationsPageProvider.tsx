"use client";

import { useQuery } from "@tanstack/react-query";
import { STAGES } from "data/clients/pipedrive/constants.generated";
import { getAllDeals } from "data/fetchers";
import { useDebounceValue, useSearchParamsMutation } from "logic/hooks";
import { type ReactNode, useContext, createContext, useMemo, useEffect, useState } from "react";

import { TabEnum } from "./NavTabs";

function useAdminApplicationsPageState() {
  const sp = useSearchParamsMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 300);

  const [stageFilter, setStageFilter] = useState(() => {
    const stageParam = sp.get("stage");

    if (stageParam) {
      const parsed = parseInt(stageParam, 10);
      if (!isNaN(parsed) && Object.values(STAGES).includes(parsed)) return parsed;
    }
    return undefined;
  });

  const [tab, setTab] = useState<TabEnum>(() => {
    const tabParam = sp.get("tab");
    if (tabParam === "test") return TabEnum.TEST;
    return TabEnum.LIVE;
  });

  const { data: deals = [], isLoading } = useQuery({
    queryKey: ["all-deals", stageFilter],
    queryFn: () => getAllDeals({ stageId: stageFilter }),
    enabled: true,
  });

  const testDeals = useMemo(() => {
    const searchId = debouncedSearchTerm.trim();

    const filtered = deals.filter((deal) => deal.is_test);
    return filtered.filter((deal) => deal.id.toString().includes(searchId));
  }, [deals, debouncedSearchTerm]);

  const liveDeals = useMemo(() => {
    const searchId = debouncedSearchTerm.trim();

    const filtered = deals.filter((deal) => !deal.is_test);
    return filtered.filter((deal) => deal.id.toString().includes(searchId));
  }, [deals, debouncedSearchTerm]);

  useEffect(() => {
    setSearchTerm("");
    sp.set("tab", tab === TabEnum.TEST ? "test" : "live");
  }, [tab, sp]);

  useEffect(() => {
    sp.set("stage", stageFilter !== undefined ? stageFilter.toString() : undefined);
  }, [stageFilter, sp]);

  return {
    searchTerm,
    setSearchTerm,
    tab,
    setTab,
    stageFilter,
    setStageFilter,
    testDeals,
    liveDeals,
    isLoading,
  };
}

const AdminApplicationsPageContext = createContext<ReturnType<typeof useAdminApplicationsPageState> | undefined>(
  undefined,
);

export function useAdminApplicationsPage() {
  const context = useContext(AdminApplicationsPageContext);
  if (!context) throw new Error("useAdminApplicationsPage must be used within AdminApplicationsPageProvider");

  return context;
}

interface AdminApplicationsPageProviderProps {
  children: ReactNode;
}

export function AdminApplicationsPageProvider(props: AdminApplicationsPageProviderProps) {
  const { children } = props;
  const state = useAdminApplicationsPageState();

  return <AdminApplicationsPageContext.Provider value={state}>{children}</AdminApplicationsPageContext.Provider>;
}
