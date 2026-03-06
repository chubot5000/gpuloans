import {
  ARAVOLTA,
  ASSETS_ADDED_TO_MASTER_INSURANCE,
  SALEANDCONTRIBUTIONAGREEMENT_STATUS,
  WAREHOUSERECEIPT_STATUS,
} from "data/clients/pipedrive/constants.generated";

import { enumResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

export const EQUIPMENT_DELIVERY_STEPS: StepDef[] = [
  {
    id: TaskId.SALE_AGREEMENT,
    title: "Execute Sale & Contribution Agreement",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.ORDER_PROOF],
    resolveState: enumResolver({
      fieldKey: "saleAndContributionAgreement",
      stateMap: {
        [SALEANDCONTRIBUTIONAGREEMENT_STATUS["Approved"]]: "COMPLETED",
        [SALEANDCONTRIBUTIONAGREEMENT_STATUS["Under Review"]]: "PENDING",
        [SALEANDCONTRIBUTIONAGREEMENT_STATUS["UW Comments"]]: "UW_COMMENTS",
        [SALEANDCONTRIBUTIONAGREEMENT_STATUS["Rejected"]]: "REJECTED",
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.WAREHOUSE,
    title: "Executed Warehouse Receipt",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.ORDER_PROOF],
    resolveState: enumResolver({
      fieldKey: "warehouseReceipt",
      stateMap: {
        [WAREHOUSERECEIPT_STATUS["Under Review"]]: "PENDING",
        [WAREHOUSERECEIPT_STATUS["Approved"]]: "COMPLETED",
        [WAREHOUSERECEIPT_STATUS["UW Comments"]]: "UW_COMMENTS",
        [WAREHOUSERECEIPT_STATUS["Rejected"]]: "REJECTED",
      },
      defaultState: "TODO",
      isAvailable: (ctx) => {
        const status = ctx.dealDetail?.custom_fields.warehouseReceipt;
        const override = ctx.dealDetail?.custom_fields.warehouseReceiptOverride;

        if (override) return true;

        if (status === WAREHOUSERECEIPT_STATUS["Approved"]) return true;
        if (status === WAREHOUSERECEIPT_STATUS["Rejected"]) return true;

        return false;
      },
    }),
  },
  {
    id: TaskId.MONITORING,
    title: "Install Aravolta Heartbeat Monitoring",
    type: "LINK",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
    },
    deps: [TaskId.ORDER_PROOF],
    resolveState: enumResolver({
      fieldKey: "aravolta",
      stateMap: {
        [ARAVOLTA.SSH]: "COMPLETED",
        [ARAVOLTA["No SSH"]]: "COMPLETED",
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.INSURANCE,
    title: "Assets Added to Master Insurance Policy",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.SALE_AGREEMENT],
    resolveState: enumResolver({
      fieldKey: "masterInsurancePolicy",
      stateMap: {
        [ASSETS_ADDED_TO_MASTER_INSURANCE["Under Review"]]: "PENDING",
        [ASSETS_ADDED_TO_MASTER_INSURANCE["Completed"]]: "COMPLETED",
        [ASSETS_ADDED_TO_MASTER_INSURANCE["Pending"]]: "PENDING",
        [ASSETS_ADDED_TO_MASTER_INSURANCE["Rejected"]]: "REJECTED",
      },
      defaultState: "TODO",
    }),
  },
];
