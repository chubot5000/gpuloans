"use client";

import type { StepState } from "logic/components";
import { ApplicationStep } from "logic/components";
import { useApplication } from "logic/pages";

import { StepId, TaskId } from "../../core/constants";

import { InsuranceContent } from "./InsuranceContent";
import { MonitoringContent } from "./MonitoringContent";
import { SaleAgreementContent } from "./SaleAgreementContent";
import { WarehouseReceiptContent } from "./WarehouseReceiptContent";

const STEP_CONTENT: Partial<Record<TaskId, React.FC<{ state: StepState }>>> = {
  [TaskId.SALE_AGREEMENT]: SaleAgreementContent,
  [TaskId.WAREHOUSE]: WarehouseReceiptContent,
  [TaskId.MONITORING]: MonitoringContent,
  [TaskId.INSURANCE]: InsuranceContent,
};

export function EquipmentDeliveryStep() {
  const { getSteps } = useApplication();
  const { all } = getSteps(StepId.DELIVERY);

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
