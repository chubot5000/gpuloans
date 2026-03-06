import {
  CUSTOMERSERVICEAGREEMENT_STATUS,
  SPV_ONE_STOP,
  SPVONESTOP_STATUS,
} from "data/clients/pipedrive/constants.generated";

import { enumResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

export const SPV_STEPS: StepDef[] = [
  {
    id: TaskId.SPV_LLC_FORMATION,
    title: "SPV LLC Formation",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.KYB],
    resolveState: enumResolver({
      fieldKey: "spvOneStop",
      stateMap: {
        [SPV_ONE_STOP["GPULoans"]]: "COMPLETED",
        [SPV_ONE_STOP["Self"]]: "COMPLETED",
      },
    }),
  },
  {
    id: TaskId.EXECUTED_SPV_LLC_DOCUMENTS,
    title: "Executed SPV LLC Documents",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      uwComments: "Pending",
      pending: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.SPV_LLC_FORMATION],
    resolveState: enumResolver({
      fieldKey: "spvOneStopStatus",
      stateMap: {
        [SPVONESTOP_STATUS["Under Review"]]: "PENDING",
        [SPVONESTOP_STATUS["UW Comments"]]: "UW_COMMENTS",
        [SPVONESTOP_STATUS["Approved"]]: "COMPLETED",
        [SPVONESTOP_STATUS["Rejected"]]: "REJECTED",
      },
      isAvailable: (ctx) => {
        const spvOneStop = ctx.dealDetail?.custom_fields.spvOneStop;
        const override = ctx.dealDetail?.custom_fields.spvOneStopOverride;

        if (spvOneStop === SPV_ONE_STOP["Self"]) return true;

        if (spvOneStop === SPV_ONE_STOP["GPULoans"]) {
          if (!override) return false;
          return true;
        }

        return false;
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.CSA,
    title: "Customer Service Agreement",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.EXECUTED_SPV_LLC_DOCUMENTS],
    resolveState: enumResolver({
      fieldKey: "customerServiceAgreement",
      stateMap: {
        [CUSTOMERSERVICEAGREEMENT_STATUS["Under Review"]]: "PENDING",
        [CUSTOMERSERVICEAGREEMENT_STATUS["Approved"]]: "COMPLETED",
        [CUSTOMERSERVICEAGREEMENT_STATUS["UW Comments"]]: "UW_COMMENTS",
        [CUSTOMERSERVICEAGREEMENT_STATUS["Rejected"]]: "REJECTED",
      },
      isAvailable: (ctx) => {
        const status = ctx.dealDetail?.custom_fields.customerServiceAgreement;
        const override = ctx.dealDetail?.custom_fields.customerServiceAgreementOverride;

        if (override) return true;
        if (status === CUSTOMERSERVICEAGREEMENT_STATUS["Approved"]) return true;
        if (status === CUSTOMERSERVICEAGREEMENT_STATUS["Rejected"]) return true;

        return false;
      },
      defaultState: "TODO",
    }),
  },
];
