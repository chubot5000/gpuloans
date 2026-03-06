"use client";

import { useMutation } from "@tanstack/react-query";
import { useDebounceCallback } from "logic/hooks";
import { FormEvent, useEffect, useState } from "react";
import { Button, Drawer, Input } from "ui/components";
import { isAddress } from "viem";
import z from "zod";

import { AdminNavCard } from "../AdminNavCard";

import { whitelistRecipient } from "./whitelistRecipient";

export function AddRecipientWhitelist() {
  const [isOpen, setIsOpen] = useState(false);
  const [borrowerEmail, setBorrowerEmail] = useState("");
  const [borrowerAddress, setBorrowerAddress] = useState("");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [{ emailError, borrowerError, recipientError }, setErrors] = useState<{
    emailError: string | undefined;
    borrowerError: string | undefined;
    recipientError: string | undefined;
  }>({ emailError: undefined, borrowerError: undefined, recipientError: undefined });

  const debouncedSetErrors = useDebounceCallback(setErrors, 500);

  useEffect(() => {
    debouncedSetErrors({
      emailError: borrowerEmail
        ? z.email("Invalid email address").safeParse(borrowerEmail).error?.issues[0]?.message
        : undefined,
      borrowerError: borrowerAddress && !isAddress(borrowerAddress) ? "Invalid address" : undefined,
      recipientError: recipientAddress && !isAddress(recipientAddress) ? "Invalid address" : undefined,
    });
  }, [borrowerEmail, borrowerAddress, recipientAddress, debouncedSetErrors]);

  const {
    data: mutationResult,
    reset: resetMutationResult,
    mutate: whitelistRecipientMutation,
    error: mutationError,
    isPending,
  } = useMutation({
    mutationFn: async () => {
      if (!isAddress(borrowerAddress) || !isAddress(recipientAddress)) {
        throw new Error("Invalid addresses");
      }

      return await whitelistRecipient({ borrowerEmail, borrowerAddress, recipientAddress });
    },
  });

  const canSubmit = Boolean(
    recipientAddress && borrowerAddress && borrowerEmail && !emailError && !borrowerError && !recipientError,
  );

  const handleSubmit = (e: FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (mutationResult?.success) return resetState();

    if (!canSubmit) return;

    whitelistRecipientMutation();
  };

  const resetState = () => {
    resetMutationResult();
    setBorrowerEmail("");
    setBorrowerAddress("");
    setRecipientAddress("");
    setErrors({ emailError: undefined, borrowerError: undefined, recipientError: undefined });
  };

  const handleClose = () => {
    setIsOpen(false);
    resetState();
  };

  return (
    <>
      <AdminNavCard onClick={() => setIsOpen(true)}>Add Recipient Whitelist</AdminNavCard>
      <Drawer isOpen={isOpen} onClose={handleClose} className="">
        <Drawer.Title>Add Recipient Whitelist</Drawer.Title>
        <Drawer.Children>
          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <label htmlFor="whitelist-borrower-email" className="text-sm text-text-secondary">
                Borrower Email:
              </label>
              <Input
                id="whitelist-borrower-email"
                type="text"
                value={borrowerEmail}
                onChange={(value) => setBorrowerEmail(value)}
                error={emailError ?? undefined}
                placeholder="email@example.com"
                className="border border-outline-major"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="whitelist-borrower-address" className="text-sm text-text-secondary">
                Borrower Address:
              </label>
              <Input
                id="whitelist-borrower-address"
                type="text"
                value={borrowerAddress}
                onChange={(value) => setBorrowerAddress(value)}
                error={borrowerError ?? undefined}
                placeholder="0x..."
                className="border border-outline-major"
              />
            </div>
            <div className="flex flex-col gap-3">
              <label htmlFor="whitelist-recipient-address" className="text-sm text-text-secondary">
                Recipient Address:
              </label>
              <Input
                id="whitelist-recipient-address"
                type="text"
                value={recipientAddress}
                onChange={(value) => setRecipientAddress(value)}
                error={recipientError ?? undefined}
                placeholder="0x..."
                className="border border-outline-major"
              />
            </div>
            <div className="flex flex-col">
              {mutationError && <div className="text-sm text-red-400">{mutationError.message}</div>}
              <Button
                onClick={handleSubmit}
                type="button"
                className="w-full mt-2"
                disabled={!canSubmit}
                isLoading={isPending}
              >
                {mutationResult?.success ? "Done" : "Submit"}
              </Button>
            </div>
          </form>
        </Drawer.Children>
      </Drawer>
    </>
  );
}
