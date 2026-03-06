import type { StepState } from "logic/components";
import { ApplicationStep } from "logic/components";
import { useApplication } from "logic/pages";

import { StepId, TaskId } from "../../core/constants";

import { BridgeContent } from "./BridgeContent";
import { ColocationContent } from "./ColocationContent";
import { KybContent } from "./KybContent";
import { LegalReviewContent } from "./LegalReviewContent";
import { ExecutedOfftakeContent } from "./OfftakeContent";
import { OnePagerContent } from "./OnePagerContent";
import { OnOfframpContent } from "./OnOfframpContent";
import { PoContent } from "./PoContent";

const STEP_CONTENT: Partial<Record<TaskId, React.FC<{ state: StepState }>>> = {
  [TaskId.KYB]: KybContent,
  [TaskId.COLOCATION]: ColocationContent,
  [TaskId.ONE_PAGER]: OnePagerContent,
  [TaskId.OFFTAKE]: ExecutedOfftakeContent,
  [TaskId.PO_OEM]: PoContent,
  [TaskId.ONRAMP_OFFRAMP]: OnOfframpContent,
  [TaskId.BRIDGE]: BridgeContent,
  [TaskId.COUNTRY_LEGAL_REVIEW]: LegalReviewContent,
};

export function DueDiligenceStep() {
  const { getSteps } = useApplication();
  const { all } = getSteps(StepId.DD);

  return (
    <div className="flex flex-col gap-4">
      {all.map((step) => {
        const Content = STEP_CONTENT[step.id];
        return (
          <ApplicationStep
            key={step.id}
            state={step.state}
            type={step.type}
            title={step.title}
            actionLabel={step.actionLabel}
            taskId={step.id}
            stepId={step.stepSlug}
          >
            {step.content ?? (Content && <Content state={step.state} />)}
          </ApplicationStep>
        );
      })}
    </div>
  );
}
