"use client";

import { useQuery } from "@tanstack/react-query";
import { getAccountDeals } from "data/fetchers";

import { useConnectedEmail } from "./useConnectedEmail";

export function useAccountDeals() {
  const email = useConnectedEmail();

  const query = useQuery({
    queryKey: ["person-deals", email],
    queryFn: () => {
      if (!email) throw new Error("Email is required");
      return getAccountDeals({ email });
    },
    enabled: Boolean(email),
  });

  const activeDeals = query.data?.deals.filter((deal) => deal.status === "open" || deal.status === "won");

  return {
    ...query,
    activeDeals,
    personName: query.data?.personName,
  };
}
