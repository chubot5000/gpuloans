import { STAGES } from "data/clients/pipedrive/constants.generated";
import type { CallStatusType, DealDetail } from "data/fetchers";
import type { StepState, TaskType } from "logic/components";
import { isAtOrPastStage } from "logic/utils";
import type { ReactNode } from "react";

import { StepId, TaskId } from "./constants";

export type StepContext = {
  stage: STAGES;
  dealDetail?: DealDetail | null;
  callStatus?: CallStatusType;
  backendOverrides?: Partial<Record<TaskId, StepState | null>>;
};

export type StateResolver = (ctx: StepContext) => StepState;

export type StepDef = {
  id: TaskId;
  title: string | ((ctx: StepContext) => string);
  type: TaskType;
  deps?: TaskId[];
  labels: {
    unavail: string;
    todo: string;
    pending: string;
    done: string;
    uwComments?: string;
    rejected?: string;
  };
  content?: ReactNode;
  resolveState: StateResolver;
};

export type StepType = Omit<StepDef, "title"> & {
  title: string;
  state: StepState;
  actionLabel: string;
  stepSlug: StepId;
};

export function createResolver(config: {
  isAvailable?: (ctx: StepContext) => boolean;
  doneAt?: STAGES;
  pendingAt?: STAGES;
  isComplete?: (deal: DealDetail) => boolean;
  fieldKey?: keyof DealDetail["custom_fields"];
  stateMap?: Partial<Record<number, StepState>>;
  useCallStatus?: boolean;
  callCompletedStage?: STAGES;
  defaultState?: StepState;
}): StateResolver {
  return (ctx) => {
    // Check availability using the custom function
    if (config.isAvailable && !config.isAvailable(ctx)) return "UNAVAILABLE";

    if (config.useCallStatus) {
      if (config.callCompletedStage && isAtOrPastStage(ctx.stage, config.callCompletedStage)) return "COMPLETED";
      if (ctx.callStatus === "completed") return "COMPLETED";
      if (ctx.callStatus === "cancelled") return "REJECTED";
      if (ctx.callStatus === "scheduled") return "PENDING";
      return "TODO";
    }
    if (config.fieldKey && config.stateMap) {
      const value = ctx.dealDetail?.custom_fields[config.fieldKey];
      if (typeof value === "number" && value in config.stateMap) return config.stateMap[value]!;
    }
    if (config.doneAt && isAtOrPastStage(ctx.stage, config.doneAt)) return "COMPLETED";
    if (config.isComplete && ctx.dealDetail && config.isComplete(ctx.dealDetail)) return "PENDING";
    if (config.pendingAt && isAtOrPastStage(ctx.stage, config.pendingAt)) return "PENDING";
    return config.defaultState ?? "TODO";
  };
}

export const stageResolver = (opts: {
  isAvailable?: (ctx: StepContext) => boolean;
  pendingAt?: STAGES;
  doneAt: STAGES;
}) => createResolver(opts);
export const callStatusResolver = (opts: {
  isAvailable?: (ctx: StepContext) => boolean;
  callCompletedStage?: STAGES;
}) => createResolver({ ...opts, useCallStatus: true });
export const fieldResolver = (opts: {
  isAvailable?: (ctx: StepContext) => boolean;
  doneAt: STAGES;
  isComplete: (deal: DealDetail) => boolean;
}) => createResolver(opts);
export const enumResolver = <K extends keyof DealDetail["custom_fields"]>(opts: {
  isAvailable?: (ctx: StepContext) => boolean;
  fieldKey: K;
  stateMap: Partial<Record<number, StepState>>;
  defaultState?: StepState;
}) => createResolver(opts);
export const disabledResolver = () => createResolver({ defaultState: "UNAVAILABLE" });

export function compositeResolver(...resolvers: Array<(ctx: StepContext) => StepState | null>): StateResolver {
  return (ctx) => {
    for (const resolver of resolvers) {
      const result = resolver(ctx);
      if (result !== null) return result;
    }
    return "TODO";
  };
}
