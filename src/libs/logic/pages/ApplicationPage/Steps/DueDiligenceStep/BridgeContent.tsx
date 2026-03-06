"use client";

import type { StepState } from "logic/components";

import { LockedStep } from "../../components";

interface BridgeContentProps {
  state: StepState;
}

export function BridgeContent({ state }: BridgeContentProps) {
  if (state === "UNAVAILABLE") return <LockedStep />;

  return null;
}
