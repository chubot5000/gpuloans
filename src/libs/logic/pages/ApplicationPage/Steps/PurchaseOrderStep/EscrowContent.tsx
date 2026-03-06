import type { StepState } from "logic/components";
import { Ty } from "ui/components";

import { LockedStep } from "../../components";

export function EscrowContent({ state }: { state: StepState }) {
  if (state === "UNAVAILABLE")
    return (
      <LockedStep message="Once loan proceeds are in escrow, you will be able to view the on-chain transaction below." />
    );

  return (
    <div className="flex flex-wrap gap-4 justify-between p-4 shadow-base md:p-8">
      <div className="flex gap-2 divide-x divide-outline-minor [&>div]:pr-2">
        <div className="flex gap-2">
          <p className="text-text-secondary">Amount:</p>
          <Ty value={null} className="text-text-primary" />
        </div>

        <div className="flex gap-2">
          <p className="text-text-secondary">Time:</p>
          <Ty value={null} className="text-text-primary" />
        </div>
      </div>
    </div>
  );
}
