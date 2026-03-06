import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { usePrivy } from "@privy-io/react-auth";
import { useState } from "react";

import { AccountModal } from "./AccountModal";

export function ConnectedWalletButton() {
  const { user } = usePrivy();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  return (
    <>
      <button
        className="flex size-7.5 items-center justify-center border border-primary"
        onClick={() => setIsOpen(true)}
        type="button"
      >
        <ChevronDownIcon className="size-4 stroke-2 text-primary" />
      </button>
      <AccountModal isOpen={isOpen} onClose={setIsOpen} user={user} />
    </>
  );
}
