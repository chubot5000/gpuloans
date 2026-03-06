"use client";

import { useApplication } from "logic/pages";
import { cn } from "logic/utils";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Msg, Select, type SelectOption } from "ui/components";

import { type StepStats } from "./core";
import { getStepById, StepId, STEPS } from "./core/constants";
import {
  IntakeStep,
  DueDiligenceStep,
  SPVFormationStep,
  PurchaseOrderStep,
  EquipmentDeliveryStep,
  FundingStep,
} from "./Steps";

interface StepBadgeProps {
  stats: StepStats;
}

function getStepBadgeClassName(stats: StepStats): string {
  const isCompleted = stats.total > 0 && stats.done === stats.total;
  const hasActiveTasks = stats.active > 0;

  if (isCompleted) return "bg-status-green-50 text-status-green-500";
  if (hasActiveTasks) return "bg-fill-primary text-text-light-primary";
  return "bg-text-disabled text-text-light-primary";
}

function StepBadge({ stats }: StepBadgeProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-center min-w-[30px] h-5 px-2.5 text-sm tracking-tight",
        getStepBadgeClassName(stats),
      )}
    >
      {stats.active}
    </div>
  );
}

interface ApplicationStepViewProps {
  stepSlug: StepId;
}

export function ApplicationStepView(props: ApplicationStepViewProps) {
  const { stepSlug } = props;
  const { dealId, stepsProgress } = useApplication();
  const router = useRouter();
  const step = getStepById(stepSlug);

  if (!step) return <Msg>Step not found</Msg>;

  function handleStepChange(newStepId: string) {
    router.push(`/applications/${dealId}?step=${newStepId}`);
  }

  const stepOptions: SelectOption[] = STEPS.map((s) => ({
    value: s.id,
    label: s.label,
    suffix: <StepBadge stats={stepsProgress[s.id]} />,
  }));

  return (
    <div className="flex flex-col gap-8">
      <Link
        href={`/applications/${dealId}`}
        className="flex gap-1 items-center transition-colors text-secondary hover:text-primary w-fit"
      >
        <ChevronLeftIcon className="size-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="w-full">
        <Select
          value={stepSlug}
          onChange={handleStepChange}
          options={stepOptions}
          triggerClassName={cn(
            "text-3xl font-eiko px-0 font-medium h-auto py-0 border-0 bg-transparent max-w-full w-auto gap-3",
            "[&_span]:text-text-dark-primary [&_span]:h-10",
          )}
          iconClassName="size-7 text-text-fill-primary"
          dropdownClassName="max-w-full !w-80"
        />
      </div>

      <StepContent stepSlug={stepSlug} />
    </div>
  );
}

interface StepContentProps {
  stepSlug: StepId;
}

function StepContent(props: StepContentProps) {
  const { stepSlug } = props;

  switch (stepSlug) {
    case StepId.INTAKE:
      return <IntakeStep />;
    case StepId.DD:
      return <DueDiligenceStep />;
    case StepId.SPV:
      return <SPVFormationStep />;
    case StepId.PO:
      return <PurchaseOrderStep />;
    case StepId.DELIVERY:
      return <EquipmentDeliveryStep />;
    case StepId.FUNDING:
      return <FundingStep />;
    default:
      return null;
  }
}
