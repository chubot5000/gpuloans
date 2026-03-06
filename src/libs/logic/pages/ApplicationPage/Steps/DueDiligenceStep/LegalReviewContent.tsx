"use client";

import type { StepState } from "logic/components";

import { LockedStep } from "../../components";

import { LEGAL_REVIEW_MESSAGES } from "./constants";

interface LegalReviewContentProps {
  state: StepState;
}

export function LegalReviewContent({ state }: LegalReviewContentProps) {
  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      <span className="text-text-secondary">{LEGAL_REVIEW_MESSAGES[state]}</span>
    </div>
  );
}
