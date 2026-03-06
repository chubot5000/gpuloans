"use client";

import { findIndex } from "lodash";
import { type ReactNode, useCallback, useState } from "react";
import type { Address } from "viem";

export interface TxStep {
  title: string;
  loadingTitle?: string;
  action: ReactNode;
  status: "idle" | "sending" | "confirming" | "confirmed";
  error?: unknown;
  txHash?: Address;
}

export interface TxAction {
  send: (() => Promise<void> | void) | undefined;
  error: Error | null;
}

export function useTxSteps(initialSteps: TxStep[]) {
  const [steps, setSteps] = useState<TxStep[]>(initialSteps);

  const updateStepAtIndex = useCallback(
    (stepIndex: number, updates: Partial<TxStep>) => {
      setSteps((oldSteps) => {
        const newSteps = [...oldSteps];
        const currentStep = newSteps[stepIndex];

        if (!currentStep) return oldSteps;

        newSteps[stepIndex] = { ...currentStep, ...updates };
        return newSteps;
      });
    },
    [setSteps],
  );

  const resetSteps = () => {
    setSteps(initialSteps);
  };

  let currentStepIndex = findIndex(
    steps,
    // added Boolean(s.error) to fallback to failed step, Could produce bugs, will keep for now until we meet an issue
    (s) => s.status !== "confirmed" || Boolean(s.error),
  );
  if (currentStepIndex == -1) currentStepIndex = steps.length - 1;
  const currentStep = steps[currentStepIndex];

  const isDone = steps.at(-1)?.status === "confirmed";

  return {
    steps,
    updateStepAtIndex,
    resetSteps,
    currentStep,
    currentStepIndex,
    setSteps,
    isDone,
  };
}
