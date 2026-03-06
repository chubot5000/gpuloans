"use client";

import { useLinkAccount, useLogin, usePrivy } from "@privy-io/react-auth";
import { cn } from "logic/utils";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "ui/components";

import { CoinsIcon } from "./icons";

export function LoansLogin({ className, single = false }: { className?: string; single?: boolean }) {
  return (
    <div className={cn("flex-1 flex flex-col w-full max-w-md max-h-85", { "items-center": single }, className)}>
      {/* Icon */}
      <div className="flex justify-start mb-4">
        <CoinsIcon />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-eiko font-medium mb-2 text-center md:text-left">Wallet Login</h2>

      {/* Description */}
      <p className="text-sm text-text-dark-secondary font-light tracking-[-0.14px] mb-6 text-center md:text-left">
        For all current borrowers, please use your wallet to sign in.
      </p>

      {/* Connect Wallet Button */}
      <ConnectWalletButton className={cn({ "w-full mt-6": single })} />
    </div>
  );
}

function ConnectWalletButton({ className = "" }) {
  const pathname = usePathname();
  const router = useRouter();

  const onConnect = () => {
    if (pathname === "/login") {
      router.push("/loans");
    }
  };
  const { authenticated, ready } = usePrivy();
  const { linkWallet } = useLinkAccount({ onSuccess: onConnect });
  const { login } = useLogin({ onComplete: onConnect });

  const handleConnect = () => {
    if (authenticated) {
      linkWallet();
    } else {
      login({ loginMethods: ["wallet"] });
    }
  };

  return (
    <Button
      disabled={!ready}
      onClick={handleConnect}
      className={cn("w-fit bg-brown-700 hover:bg-brown-800 px-10 text-white py-3", className)}
    >
      Connect Wallet to Login
    </Button>
  );
}
