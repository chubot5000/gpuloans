import type { StepState } from "logic/components";
import { ApplicationStep } from "logic/components";
import { useApplication } from "logic/pages";

import { StepId, TaskId } from "../../core/constants";

import { ExecutedContent } from "./ExecutedContent";
import { TokenizedContent } from "./TokenizedContent";

const STEP_CONTENT: Partial<Record<TaskId, React.FC<{ state: StepState }>>> = {
  [TaskId.TOKENIZED]: TokenizedContent,
  [TaskId.EXECUTED]: ExecutedContent,
};

export function FundingStep() {
  const { getSteps } = useApplication();
  const { all } = getSteps(StepId.FUNDING);

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
