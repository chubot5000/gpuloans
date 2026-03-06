import { ApplicationStep, StepState } from "logic/components";
import { useApplication } from "logic/pages";

import { StepId, TaskId } from "../../core/constants";

import { ExecuteNda } from "./ExecuteNda";
import { IntakeCall } from "./IntakeCall";
import { TermSheet } from "./TermSheet";
import { UserApplication } from "./UserApplication";

const STEP_CONTENT: Partial<Record<TaskId, React.FC<{ state: StepState }>>> = {
  [TaskId.APP]: UserApplication,
  [TaskId.NDA]: ExecuteNda,
  [TaskId.CALL]: IntakeCall,
  [TaskId.TERM_SHEET]: TermSheet,
};

export function IntakeStep() {
  const { getSteps } = useApplication();
  const { all } = getSteps(StepId.INTAKE);

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
