import { useQuery } from "@tanstack/react-query";
import { useWeb3 } from "logic/components";

import { getBorrowerLoans } from "./data/getBorrowerLoans";

export function useBorrowerLoans() {
  const { address } = useWeb3();
  return useQuery({
    refetchOnWindowFocus: false,
    queryKey: ["borrowerLoans", address] as const,
    queryFn: ({ queryKey }) => {
      const [, address] = queryKey;
      if (!address) throw new Error("No address found");
      return getBorrowerLoans(address);
    },
    enabled: Boolean(address),
  });
}
