import { PROOF_OF_ORDER } from "data/clients/pipedrive/constants.generated";

import { disabledResolver, enumResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

export const PURCHASE_ORDER_STEPS: StepDef[] = [
  {
    id: TaskId.ORDER_PROOF,
    title: "Proof of Order Placement",
    type: "DOC",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      uwComments: "Pending",
      done: "Completed",
      rejected: "Rejected",
    },
    deps: [TaskId.PO_OEM],
    resolveState: enumResolver({
      fieldKey: "proofOfOrder",
      stateMap: {
        [PROOF_OF_ORDER["Under Review"]]: "PENDING",
        [PROOF_OF_ORDER["Approved"]]: "COMPLETED",
        [PROOF_OF_ORDER["UW Comments"]]: "UW_COMMENTS",
        [PROOF_OF_ORDER["Rejected"]]: "REJECTED",
      },
    }),
  },
  {
    id: TaskId.ESCROW,
    title: "Loan Proceeds in Escrow",
    type: "LINK",
    labels: {
      unavail: "Locked",
      todo: "To-Do",
      pending: "Pending",
      done: "Completed",
    },
    deps: [TaskId.ORDER_PROOF, TaskId.CSA],
    resolveState: disabledResolver(),
  },
];
