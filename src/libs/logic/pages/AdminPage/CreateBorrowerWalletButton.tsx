"use client";

import { useMutation } from "@tanstack/react-query";
import { useCopyToClipboard } from "logic/hooks";
import { FormEvent, useState } from "react";
import { Button, Drawer, Input } from "ui/components";
import { z } from "zod";

import { AdminNavCard } from "./AdminNavCard";

const emailSchema = z.object({
  email: z.email("Please enter a valid email address"),
});

export function CreateBorrowerWalletButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { copy, isCopied } = useCopyToClipboard();

  const {
    mutate: createBorrowerWallet,
    isPending,
    data: createBorrowerWalletData,
    reset: resetCreateBorrowerWallet,
  } = useMutation({
    mutationFn: async (validatedEmail: string) => {
      const response = await fetch("/api/privy/wallet/create", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: validatedEmail }),
      });

      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(payload?.error ?? "Failed to create borrower wallet");
      }

      return payload;
    },
    onSuccess: () => {
      setError(null);
    },
    onError: (err) => {
      setError(err instanceof Error ? err.message : "Failed to create borrower wallet");
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const result = emailSchema.safeParse({ email });
    if (!result.success) {
      setError("Invalid email address");
      return;
    }

    createBorrowerWallet(result.data.email);
  };

  const handleClose = () => {
    setIsOpen(false);
    setEmail("");
    setError(null);
    resetCreateBorrowerWallet();
  };

  const handleCopy = () => {
    if (!createBorrowerWalletData) return;
    copy(JSON.stringify(createBorrowerWalletData, null, 2));
  };

  return (
    <>
      <AdminNavCard onClick={() => setIsOpen(true)}>Create new borrower Wallet</AdminNavCard>
      <Drawer isOpen={isOpen} onClose={handleClose} className="">
        <Drawer.Title>Create new borrower Wallet</Drawer.Title>
        <Drawer.Children>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="create-borrower-email" className="text-sm text-text-secondary">
                Borrower User Email:
              </label>
              <Input
                id="create-borrower-email"
                type="text"
                value={email}
                onChange={(value) => setEmail(value)}
                error={error ?? undefined}
                placeholder="email@example.com"
                className="border border-outline-major"
              />
            </div>
            <Button type="submit" className="w-full mt-2" isLoading={isPending}>
              Submit
            </Button>
            {createBorrowerWalletData && (
              <div className="rounded-lg border border-outline-minor bg-bg-page p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs text-text-secondary">Response</p>
                  <Button type="button" onClick={handleCopy} className="h-8 px-3 text-xs">
                    {isCopied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <pre className="overflow-x-auto rounded border border-outline-minor bg-bg-primary p-3 text-xs text-primary">
                  {JSON.stringify(createBorrowerWalletData, null, 2)}
                </pre>
              </div>
            )}
          </form>
        </Drawer.Children>
      </Drawer>
    </>
  );
}
