import { disabledResolver, StepDef } from "../../core";
import { TaskId } from "../../core/constants";

export const FUNDING_STEPS: StepDef[] = [
  {
    id: TaskId.TOKENIZED,
    title: "Assets Tokenized and Sent to Borrower",
    type: "NETWORK",
    deps: [TaskId.ONRAMP_OFFRAMP, TaskId.WAREHOUSE],
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed" },
    resolveState: disabledResolver(),
  },
  {
    id: TaskId.EXECUTED,
    title: "Loan Executed",
    type: "NETWORK",
    deps: [TaskId.TOKENIZED],
    labels: { unavail: "Locked", todo: "To-Do", pending: "Pending", done: "Completed" },
    resolveState: disabledResolver(),
  },
];
