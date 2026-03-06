"use client";

import { useQuery } from "@tanstack/react-query";
import { getDealCallStatus } from "data/fetchers";

export function useDealCallStatus(dealId: number) {
  return useQuery({
    queryKey: ["deal-call-status", dealId],
    queryFn: () => getDealCallStatus(dealId!),
    enabled: Boolean(dealId),
    refetchInterval: 5000,
    refetchOnWindowFocus: true,
  });
}
