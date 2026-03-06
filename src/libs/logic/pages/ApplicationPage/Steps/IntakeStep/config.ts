import { NDA_STATUS, STAGES, TERMSHEET_STATUS } from "data/clients/pipedrive/constants.generated";
import type { DealDetail } from "data/fetchers";
import { isAtOrPastStage } from "logic/utils";

import { callStatusResolver, enumResolver, fieldResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

const USER_APPLICATION_REQUIRED_FIELDS: (keyof DealDetail["custom_fields"])[] = [
  "offtaker",
  "dataCenterOperator",
  "location",
  "dataCenterTier",
  "oem",
  "gpuType",
  "nbServers",
  "gpusPerServer",
  "ageOfGpus",
];

function isUserApplicationComplete(dealDetail: DealDetail): boolean {
  const fields = dealDetail.custom_fields;

  return USER_APPLICATION_REQUIRED_FIELDS.every((key) => {
    const value = fields[key];
    if (value === null || value === undefined) return false;
    if (typeof value === "string" && value.trim() === "") return false;
    return true;
  });
}

export const INTAKE_STEPS: StepDef[] = [
  {
    id: TaskId.NDA,
    title: "Execute NDA",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
      uwComments: "Pending",
    },
    resolveState: enumResolver({
      isAvailable: (ctx) => isAtOrPastStage(ctx.stage, STAGES.NEW_LEAD),
      fieldKey: "ndaStatus",
      stateMap: {
        [NDA_STATUS.Sent]: "TODO",
        [NDA_STATUS["Needs Review"]]: "UW_COMMENTS",
        [NDA_STATUS["Borrower Signed"]]: "PENDING",
        [NDA_STATUS["Fully Executed"]]: "COMPLETED",
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.CALL,
    title: "Intake Call with USD.AI Team",
    type: "CALL",
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed", rejected: "Rejected" },
    resolveState: callStatusResolver({
      isAvailable: (ctx) => isAtOrPastStage(ctx.stage, STAGES.NEW_LEAD),
      callCompletedStage: STAGES.INTRO_CALL_HELD,
    }),
  },
  {
    id: TaskId.APP,
    title: "Intake Form",
    type: "APP",
    deps: [TaskId.CALL, TaskId.NDA],
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed" },
    resolveState: fieldResolver({
      isAvailable: (ctx) => isAtOrPastStage(ctx.stage, STAGES.NEW_LEAD),
      doneAt: STAGES.TERM_SHEET_SENT,
      isComplete: isUserApplicationComplete,
    }),
  },
  {
    id: TaskId.TERM_SHEET,
    title: "Execute Term Sheet",
    type: "DOC",
    deps: [TaskId.CALL, TaskId.NDA, TaskId.APP],
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending", // TODO: needs to be changed
      done: "Completed",
    },
    resolveState: enumResolver({
      isAvailable: (ctx) => isAtOrPastStage(ctx.stage, STAGES.NEW_LEAD),
      fieldKey: "termSheetStatus",
      stateMap: {
        [TERMSHEET_STATUS.Sent]: "TODO",
        [TERMSHEET_STATUS["Needs Review"]]: "PENDING",
        [TERMSHEET_STATUS["Borrower Signed"]]: "UW_COMMENTS",
        [TERMSHEET_STATUS["Fully Executed"]]: "COMPLETED",
      },
      defaultState: "UNAVAILABLE",
    }),
  },
];
