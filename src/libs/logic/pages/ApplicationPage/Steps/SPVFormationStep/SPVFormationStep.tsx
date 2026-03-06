import type { StepState } from "logic/components";
import { ApplicationStep } from "logic/components";
import { useApplication } from "logic/pages";

import { StepId, TaskId } from "../../core/constants";

import { CSA } from "./CSA";
import { ExecutedSPV } from "./ExecutedSPV";
import { SPVFormation } from "./SPVFormation";

const STEP_CONTENT: Partial<Record<TaskId, React.FC<{ state: StepState }>>> = {
  [TaskId.SPV_LLC_FORMATION]: SPVFormation,
  [TaskId.EXECUTED_SPV_LLC_DOCUMENTS]: ExecutedSPV,
  [TaskId.CSA]: CSA,
};

export function SPVFormationStep() {
  const { getSteps } = useApplication();
  const { all } = getSteps(StepId.SPV);

  return (
    <div className="flex flex-col gap-3">
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
