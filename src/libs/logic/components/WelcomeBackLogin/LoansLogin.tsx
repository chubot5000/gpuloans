"use client";

import { cn } from "logic/utils";

import { CoinsIcon } from "./icons";

export function LoansLogin({ className, single = false }: { className?: string; single?: boolean }) {
  return (
    <div className={cn("flex-1 flex flex-col w-full max-w-md max-h-85", { "items-center": single }, className)}>
      <div className="flex justify-start mb-4">
        <CoinsIcon />
      </div>
      <h2 className="text-xl font-eiko font-medium mb-2 text-center md:text-left">Wallet Login</h2>
      <p className="text-sm text-text-dark-secondary font-light tracking-[-0.14px] mb-6 text-center md:text-left">
        Wallet login coming soon.
      </p>
    </div>
  );
}
