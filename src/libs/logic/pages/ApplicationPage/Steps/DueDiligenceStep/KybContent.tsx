"use client";

import type { StepState } from "logic/components";
import { useKybVerification } from "logic/hooks/useKybVerification";
import { useApplication } from "logic/pages";
import Image from "next/image";
import { Button, Ty } from "ui/components";

import { LockedStep } from "../../components";

import { KYB_MESSAGES } from "./constants";

interface KybContentProps {
  state: StepState;
}

export function KybContent({ state }: KybContentProps) {
  const {
    dealId,
    dealDetail: {
      custom_fields: { kybOverride },
    },
  } = useApplication();
  const { mutate: startKyb, isPending } = useKybVerification();

  if (state === "UNAVAILABLE") return <LockedStep />;

  if (state === "TODO") {
    return (
      <div className="flex flex-col gap-5 items-center p-8 shadow-base">
        <Image src="/images/idenfy.png" alt="iDenfy" width={100} height={100} />

        <Button
          onClick={() => {
            if (kybOverride) window.open(kybOverride, "_blank");
            else startKyb(dealId);
          }}
          disabled={isPending}
          className="w-full max-w-xs btn-primary-light md:w-52"
          isLoading={isPending}
        >
          Go to Form
        </Button>

        <Ty
          className="mt-3 text-text-secondary"
          value={
            <div className="flex flex-col gap-4">
              iDenfy is a trusted identity verification provider that specializes in compliance and fraud prevention.
              GPULoans.com partners with iDenfy to meet Know Your Business (KYB) and Anti-Money Laundering (AML)
              requirements. This form securely collects and verifies your business information so we can confirm your
              eligibility and keep our platform safe and compliant.
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="flex gap-2 items-center px-4 h-11 bg-bg-primary">
      <span className="text-sm tracking-tight text-text-secondary">{KYB_MESSAGES[state]}</span>
    </div>
  );
}
