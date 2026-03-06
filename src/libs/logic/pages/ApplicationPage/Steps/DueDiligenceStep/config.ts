import {
  BRIDGE_LOAN,
  COLOCATIONAGREEMENT_STATUS,
  DATACENTERONEPAGER_STATUS,
  JURISDICTION_REVIEW,
  KYB_STATUS,
  OEM_PAYMENT_TERMS,
  OFFTAKE_AGREEMENT,
  ONRAMP_OFFRAMP,
  PURCHASEORDER_STATUS,
} from "data/clients/pipedrive/constants.generated";

import { enumResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

export const DD_STEPS: StepDef[] = [
  {
    id: TaskId.KYB,
    title: "KYB / AML",
    type: "LINK",
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed", rejected: "Rejected" },
    deps: [TaskId.TERM_SHEET],
    resolveState: enumResolver({
      fieldKey: "kybStatus",
      stateMap: {
        [KYB_STATUS["In Process"]]: "PENDING",
        [KYB_STATUS.Approved]: "COMPLETED",
        [KYB_STATUS.Rejected]: "REJECTED",
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.ONE_PAGER,
    title: "Datacenter One-Pager",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.TERM_SHEET],
    resolveState: enumResolver({
      fieldKey: "onePager",
      stateMap: {
        [DATACENTERONEPAGER_STATUS["Under Review"]]: "PENDING",
        [DATACENTERONEPAGER_STATUS["Approved"]]: "COMPLETED",
        [DATACENTERONEPAGER_STATUS["UW Comments"]]: "UW_COMMENTS",
        [DATACENTERONEPAGER_STATUS["Rejected"]]: "REJECTED",
      },
    }),
  },
  {
    id: TaskId.PO_OEM,
    title: "Purchase Order from OEM",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
      rejected: "Rejected",
      uwComments: "Pending",
    },
    deps: [TaskId.TERM_SHEET],
    resolveState: enumResolver({
      fieldKey: "purchaseOrder",
      stateMap: {
        [PURCHASEORDER_STATUS["Under Review"]]: "PENDING",
        [PURCHASEORDER_STATUS["Approved"]]: "COMPLETED",
        [PURCHASEORDER_STATUS["UW Comments"]]: "UW_COMMENTS",
        [PURCHASEORDER_STATUS["Rejected"]]: "REJECTED",
      },
      defaultState: "TODO",
    }),
  },
  {
    id: TaskId.ONRAMP_OFFRAMP,
    title: "On/Off-Ramp",
    type: "LINK",
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed" },
    deps: [TaskId.TERM_SHEET],
    resolveState: enumResolver({
      fieldKey: "onrampOfframp",
      stateMap: {
        // [ONRAMP_OFFRAMP.Yes]: "COMPLETED",
        [ONRAMP_OFFRAMP.No]: "COMPLETED",
        [ONRAMP_OFFRAMP.Coinbase]: "COMPLETED",
      },
    }),
  },
  {
    id: TaskId.COLOCATION,
    title: "Executed Colocation Agreement",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
      uwComments: "Pending",
      rejected: "Rejected",
    },
    deps: [TaskId.KYB],
    resolveState: enumResolver({
      fieldKey: "colocationAgreement",
      stateMap: {
        [COLOCATIONAGREEMENT_STATUS["Under Review"]]: "PENDING",
        [COLOCATIONAGREEMENT_STATUS["Approved"]]: "COMPLETED",
        [COLOCATIONAGREEMENT_STATUS["UW Comments"]]: "UW_COMMENTS",
        [COLOCATIONAGREEMENT_STATUS["Rejected"]]: "REJECTED",
      },
    }),
  },
  {
    id: TaskId.OFFTAKE,
    title: "Executed Offtake Agreement / LOI",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
      uwComments: "Pending",
      rejected: "Rejected",
    },
    deps: [TaskId.KYB],
    resolveState: enumResolver({
      fieldKey: "offtakeAgreement",
      stateMap: {
        [OFFTAKE_AGREEMENT["Under Review"]]: "PENDING",
        [OFFTAKE_AGREEMENT["Approved"]]: "COMPLETED",
        [OFFTAKE_AGREEMENT["UW Comments"]]: "UW_COMMENTS",
        [OFFTAKE_AGREEMENT["Rejected"]]: "REJECTED",
      },
    }),
  },
  {
    id: TaskId.BRIDGE,
    title: "Bridge Loan Onboarding",
    type: "DOC",
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed", rejected: "Rejected" },
    resolveState: (ctx) => {
      const net30 = ctx.dealDetail?.custom_fields?.net30;
      const bridgeLoanStatus = ctx.dealDetail?.custom_fields?.bridgeLoan;

      if (bridgeLoanStatus === BRIDGE_LOAN.Yes) return "COMPLETED";

      if (net30 === OEM_PAYMENT_TERMS.No && bridgeLoanStatus === null) return "TODO";

      if (bridgeLoanStatus === BRIDGE_LOAN.Yes) return "PENDING";
      if (bridgeLoanStatus === BRIDGE_LOAN.Equity) return "COMPLETED";

      return "UNAVAILABLE";
    },
  },
  {
    id: TaskId.COUNTRY_LEGAL_REVIEW,
    title: (ctx) => {
      const location = ctx.dealDetail?.custom_fields?.location;
      if (!location) return "Legal Review";

      const country = location.includes(", ") ? location.split(", ").pop() : location;
      return country ? `${country} Legal Review` : "Legal Review";
    },
    type: "LINK",
    deps: [TaskId.APP],
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed", rejected: "Rejected" },
    resolveState: (ctx) => {
      const location = ctx.dealDetail?.custom_fields?.location;
      const isAllowedCountry = location === "United States" || location?.includes(", United States");

      if (isAllowedCountry) return "COMPLETED";

      const jurisdictionReview = ctx.dealDetail?.custom_fields?.jurisdictionReview;
      if (typeof jurisdictionReview === "number") {
        if (jurisdictionReview === JURISDICTION_REVIEW["Under Review"]) return "PENDING";
        if (jurisdictionReview === JURISDICTION_REVIEW.Approved) return "COMPLETED";
        if (jurisdictionReview === JURISDICTION_REVIEW.Rejected) return "REJECTED";
      }

      return "PENDING";
    },
  },
];
