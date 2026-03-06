"use client";

import { motion } from "framer-motion";
import type { TxStep } from "logic/hooks";
import { useCopyToClipboard } from "logic/hooks";
import { cn } from "logic/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Spinner } from "ui/components";
import { BaseError, UserRejectedRequestError } from "viem";

import { getContractErrorName } from "./getContractErrorName";

export interface StepProps {
  step: TxStep;
  index: number;
  currentStepIndex: number;
  stepContent?: ReactNode;
}

export function Step(props: StepProps) {
  const { step, index, currentStepIndex, stepContent } = props;

  const isActive = index === currentStepIndex;
  const isFinalized = index < currentStepIndex;

  const isLoading = step.status === "sending" || step.status === "confirming";
  const isFailed = Boolean(
    step.error && !(step.error instanceof BaseError && step.error.walk((e) => e instanceof UserRejectedRequestError)),
  );

  return (
    <div className="group flex items-start gap-3 last:min-h-0">
      {/* Square and line */}
      <div className="flex h-full flex-col items-center gap-2">
        {isLoading ? (
          <Spinner className="mt-1 size-4 text-primary" />
        ) : (
          <div
            className={cn(`mx-auto mt-1 flex h-4 w-4 items-center justify-center border-2 border-primary`, {
              "border-[#7ABB67] bg-transparent": step.status == "idle",
              "border-[#81BB70] bg-[#81BB70]": step.status == "confirmed",
              "border-[#DE8E87] bg-[#DE8E87]": isFailed,
              "border-bg-secondary bg-bg-secondary": !isFinalized && !isActive,
            })}
          />
        )}
        <StepLine isFailed={isFailed} isFinalized={isFinalized} />
      </div>

      {/* Title & content & error */}
      <div className="flex flex-col">
        <span className={cn("text-base", { "text-stone-300": !isFinalized && !isActive })}>{step.title}</span>
        {(isActive || isFinalized) && stepContent ? <div className="flex flex-col gap-1">{stepContent}</div> : null}
        {isFailed ? <StepError error={step.error} /> : null}
      </div>
    </div>
  );
}

interface StepLineProps {
  isFinalized: boolean;
  isFailed: boolean;
}
// TODO: fix animation for multi steps orchestration
function StepLine({ isFinalized, isFailed }: StepLineProps) {
  return (
    <div className="relative grid min-h-16 w-[1px] grow">
      <div className="size-full bg-stone-300 group-last:hidden" />
      <motion.div
        animate={{ height: isFinalized ? "100%" : "0%" }}
        className={cn(`absolute top-0 size-full bg-primary group-last:hidden`, {
          "bg-[#FF9B9B]": isFailed,
        })}
        initial={{ height: "0%" }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

export function StepError({ error }: { error: unknown }) {
  const { copy, isCopied } = useCopyToClipboard();

  return (
    <div className="mt-2 flex items-center gap-1 text-sm text-[#FF9B9B]">
      <button
        className="flex items-center gap-1"
        onClick={() => error instanceof Error && copy(error.message)}
        type="button"
      >
        <span className="text-left">{getContractErrorName(error)}</span>
        {isCopied ? <CopyCheckIcon className="size-4 shrink-0" /> : <CopyIcon className="size-4 shrink-0" />}
      </button>
    </div>
  );
}
