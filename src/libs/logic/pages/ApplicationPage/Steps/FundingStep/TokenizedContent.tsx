import type { StepState } from "logic/components";

import { LockedStep } from "../../components";

export function TokenizedContent({ state }: { state: StepState }) {
  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">
        Your assets are being tokenized and will be sent to your wallet upon completion.
      </p>
    </div>
  );
}
