import { usePrivy } from "@privy-io/react-auth";
import { useMemo } from "react";

import { privyUserMetadataSchema } from "./privyUserMetadata";

export function usePrivyUserMetadata() {
  const { user } = usePrivy();

  const metadata = useMemo(() => {
    if (!user?.customMetadata) return { linkedWallets: [] };
    return privyUserMetadataSchema.parse(user.customMetadata);
  }, [user?.customMetadata]);

  return metadata;
}
