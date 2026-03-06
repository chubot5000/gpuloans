"use client";

import { usePrivy } from "@privy-io/react-auth";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "ui/components";

export function ConnectWalletButton() {
  const router = useRouter();
  const pathname = usePathname();
  const { ready } = usePrivy();

  const onClick = () => {
    router.push("/login");
  };

  if (pathname === "/login") return null;

  return (
    <Button
      onClick={onClick}
      className="inline-flex px-9 w-36 h-11 btn-primary lg:px-6"
      disabled={!ready}
      type="button"
    >
      Login
    </Button>
  );
}
