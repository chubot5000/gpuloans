import type { StepState } from "logic/components";

import { LockedStep } from "../../components";

export function ExecutedContent({ state }: { state: StepState }) {
  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-text-secondary">
        Your loan will be executed and funds disbursed upon completion of all requirements.
      </p>
    </div>
  );
}
