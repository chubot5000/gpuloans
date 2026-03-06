import type { StepState } from "logic/components";



export const STATE_MESSAGES: Record<StepState, string> = {
  TODO: "Please review and sign the Non-Disclosure Agreement to continue.",
  PENDING: "NDA signature in progress.",
  COMPLETED: "NDA has been signed and executed.",
  UNAVAILABLE: "This step is not yet available.",
  UW_COMMENTS: "Please review the NDA and address any comments.",
  REJECTED: "NDA was rejected. Please contact support.",
};
