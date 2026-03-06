import type { StepState } from "logic/components";

import { DD_STEPS } from "../Steps/DueDiligenceStep/config";
import { EQUIPMENT_DELIVERY_STEPS } from "../Steps/EquipmentDeliveryStep/config";
import { FUNDING_STEPS } from "../Steps/FundingStep/config";
import { INTAKE_STEPS } from "../Steps/IntakeStep/config";
import { PURCHASE_ORDER_STEPS } from "../Steps/PurchaseOrderStep/config";
import { SPV_STEPS } from "../Steps/SPVFormationStep/config";

import { StepId } from "./constants";
import { StepContext, StepDef, StepType } from "./resolvers";

const STATE_CONFIG = {
  UNAVAILABLE: { isActive: false, labelKey: "unavail" },
  REJECTED: { isActive: false, labelKey: "rejected" },
  COMPLETED: { isActive: false, labelKey: "done" },
  UW_COMMENTS: { isActive: true, labelKey: "uwComments" },
  PENDING: { isActive: true, labelKey: "pending" },
  TODO: { isActive: true, labelKey: "todo" },
} as const satisfies Record<StepState, { isActive: boolean; labelKey: string }>;

function getLabel(step: StepDef, state: StepState): string {
  return step.labels[STATE_CONFIG[state].labelKey as keyof StepDef["labels"]] ?? step.labels.todo ?? state;
}

// Check backend overrides first, then use the normal resolver logic
function resolveStateWithOverride(step: StepDef, ctx: StepContext): StepState {
  if (ctx.backendOverrides) {
    const backendOverride = ctx.backendOverrides[step.id];
    if (backendOverride !== null && backendOverride !== undefined) return backendOverride;
  }

  return step.resolveState(ctx);
}

function computeSteps(steps: StepDef[], ctx: StepContext, stepSlug: StepId, allComputedSteps: StepType[] = []) {
  const computed = steps.map((step) => {
    const state = resolveStateWithOverride(step, ctx);
    const title = typeof step.title === "function" ? step.title(ctx) : step.title;
    return { ...step, title, state, actionLabel: getLabel(step, state), stepSlug } as StepType;
  });

  const computedWithDeps = computed.map((step) => {
    const hasBackendOverride =
      ctx.backendOverrides?.[step.id] !== null && ctx.backendOverrides?.[step.id] !== undefined;

    if (step.deps && step.deps.length > 0 && !hasBackendOverride) {
      const allDepsCompleted = step.deps.every((depId) => {
        const depStep = allComputedSteps.find((s) => s.id === depId);
        return depStep?.state === "COMPLETED";
      });

      if (!allDepsCompleted)
        return { ...step, state: "UNAVAILABLE" as StepState, actionLabel: getLabel(step, "UNAVAILABLE") };
    }
    return step;
  });

  const byActive = (active: boolean) => computedWithDeps.filter((s) => STATE_CONFIG[s.state].isActive === active);
  const done = computedWithDeps.filter((s) => s.state === "COMPLETED").length;
  const activeSteps = byActive(true);
  return {
    all: computedWithDeps,
    active: activeSteps,
    inactive: byActive(false),
    stats: { total: computedWithDeps.length, done, active: activeSteps.length },
  };
}

const STEP_CATEGORIES: Array<{ slug: StepId; steps: StepDef[] }> = [
  { slug: StepId.INTAKE, steps: INTAKE_STEPS },
  { slug: StepId.DD, steps: DD_STEPS },
  { slug: StepId.SPV, steps: SPV_STEPS },
  { slug: StepId.PO, steps: PURCHASE_ORDER_STEPS },
  { slug: StepId.DELIVERY, steps: EQUIPMENT_DELIVERY_STEPS },
  { slug: StepId.FUNDING, steps: FUNDING_STEPS },
];

type ActionItems = {
  todo: StepType[];
  pending: StepType[];
  completed: StepType[];
  rejected: StepType[];
};

export function computeAllSteps(ctx: StepContext) {
  const bySlug = {} as Record<StepId, ReturnType<typeof computeSteps>>;
  const stepsProgress = {} as Record<StepId, { total: number; done: number; active: number }>;
  const task = { todo: [], pending: [], completed: [], rejected: [] } as ActionItems;
  let total = 0,
    done = 0,
    active = 0;

  const allComputedSteps: StepType[] = [];
  for (const { slug, steps } of STEP_CATEGORIES) {
    for (const step of steps) {
      const state = resolveStateWithOverride(step, ctx);
      const title = typeof step.title === "function" ? step.title(ctx) : step.title;
      allComputedSteps.push({ ...step, title, state, actionLabel: getLabel(step, state), stepSlug: slug });
    }
  }

  for (const { slug, steps } of STEP_CATEGORIES) {
    const result = computeSteps(steps, ctx, slug, allComputedSteps);
    bySlug[slug] = result;
    stepsProgress[slug] = result.stats;

    for (const step of result.all) {
      if (step.state === "TODO") task.todo.push(step);
      else if (step.state === "COMPLETED") task.completed.push(step);
      else if (step.state === "REJECTED") task.rejected.push(step);
      else task.pending.push(step);
    }

    total += result.stats.total;
    done += result.stats.done;
    active += result.stats.active;
  }

  return { bySlug, stepsProgress, taskProgress: { total, done, active }, task };
}

export type StepsResult = ReturnType<typeof computeSteps>;
export type StepStats = StepsResult["stats"];
export type AllStepsResult = ReturnType<typeof computeAllSteps>;
