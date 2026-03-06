import { TaskType } from "logic/components";

export enum DocumentId {
  NDA = "nda",
  TERM_SHEET = "term_sheet",
  KYB_AML = "kyb_aml",
  COLOCATION_AGREEMENT = "colocation_agreement",
  OFFTAKE_AGREEMENT = "offtake_agreement",
  DATA_CENTER_ONE_PAGER = "data_center_one_pager",
  PURCHASE_ORDER = "purchase_order",
  BRIDGE_LOAN = "bridge_loan",
  JURISDICTION = "jurisdiction",
  CERTIFICATE_OF_FORMATION = "certificate_of_formation",
  CONTACT_INFORMATION = "contact_information",
  FORMATION_EVIDENCE = "formation_evidence",
  LLC_AGREEMENT = "llc_agreement",
  APPROVAL_RA_IM = "approval_ra_im",
  PROOF_OF_ORDER = "proof_of_order",
  SALE_AND_CONTRIBUTION = "sale_and_contribution",
  WAREHOUSE_RECEIPT = "warehouse_receipt",
  INSURANCE = "insurance",
}

export enum StepId {
  INTAKE = "borrower-intake",
  DD = "due-diligence",
  SPV = "spv-formation",
  PO = "purchase-order",
  DELIVERY = "equipment-delivery",
  FUNDING = "funding",
}

export enum TaskId {
  APP = "user-application",
  NDA = "execute-nda",
  CALL = "intake-call",
  TERM_SHEET = "executed-term-sheet",
  KYB = "kyb-aml",
  ONE_PAGER = "data-center-one-pager",
  PO_OEM = "purchase-order-oem",
  ONRAMP_OFFRAMP = "onramp-offramp",
  COLOCATION = "colocation-agreement",
  OFFTAKE = "offtake-agreement",
  BRIDGE = "bridge-loan-onboarding",
  COUNTRY_LEGAL_REVIEW = "country-legal-review",
  EXECUTED_SPV_LLC_DOCUMENTS = "executed-spv-llc-documents",
  SPV_LLC_FORMATION = "spv-llc-formation",
  CSA = "customer-service-agreement",
  ORDER_PROOF = "proof-of-order-placement",
  ESCROW = "loan-proceeds-in-escrow",
  SALE_AGREEMENT = "executed-sale-contribution-agreement",
  MONITORING = "install-aravolta-monitoring",
  WAREHOUSE = "executed-warehouse-receipt",
  INSURANCE = "chips-added-to-master-insurance-policy",
  TOKENIZED = "assets-tokenized",
  EXECUTED = "loan-executed",
}

export interface BorrowTask {
  label: string;
  id: TaskId;
  type: TaskType;
}

export interface BorrowStep {
  label: string;
  id: StepId;
  tasks: BorrowTask[];
}

export const STEPS = [
  {
    label: "Borrower Intake",
    id: StepId.INTAKE,
    tasks: [
      { id: TaskId.CALL, type: "CALL" },
      { id: TaskId.APP, type: "APP" },
      { id: TaskId.NDA, type: "DOC" },
      { id: TaskId.TERM_SHEET, type: "DOC" },
    ],
  },
  {
    label: "Due Diligence",
    id: StepId.DD,
    tasks: [
      { id: TaskId.KYB, type: "LINK" },
      { id: TaskId.ONE_PAGER, type: "DOC" },
      { id: TaskId.PO_OEM, type: "DOC" },
      { id: TaskId.ONRAMP_OFFRAMP, type: "LINK" },
      { id: TaskId.COLOCATION, type: "DOC" },
      { id: TaskId.OFFTAKE, type: "DOC" },
      { id: TaskId.BRIDGE, type: "DOC" },
      { id: TaskId.COUNTRY_LEGAL_REVIEW, type: "LINK" },
    ],
  },
  {
    label: "SPV Formation",
    id: StepId.SPV,
    tasks: [
      { id: TaskId.SPV_LLC_FORMATION, type: "DOC" },
      { id: TaskId.EXECUTED_SPV_LLC_DOCUMENTS, type: "DOC" },
      { id: TaskId.CSA, type: "DOC" },
    ],
  },
  {
    label: "Purchase Order",
    id: StepId.PO,
    tasks: [
      { id: TaskId.ORDER_PROOF, type: "DOC" },
      { id: TaskId.ESCROW, type: "LINK" },
    ],
  },
  {
    label: "Equipment Delivery & Install",
    id: StepId.DELIVERY,
    tasks: [
      { id: TaskId.SALE_AGREEMENT, type: "DOC" },
      { id: TaskId.MONITORING, type: "LINK" },
      { id: TaskId.WAREHOUSE, type: "DOC" },
      { id: TaskId.INSURANCE, type: "DOC" },
    ],
  },
  {
    label: "Funding",
    id: StepId.FUNDING,
    tasks: [
      { id: TaskId.TOKENIZED, type: "NETWORK" },
      { id: TaskId.EXECUTED, type: "NETWORK" },
    ],
  },
] as const;

// Lookup helpers
const STEPS_BY_ID = Object.fromEntries(STEPS.map((step) => [step.id, step])) as unknown as Record<StepId, BorrowStep>;

export function getStepById(id: StepId) {
  return STEPS_BY_ID[id];
}

export function getTaskById(taskId: TaskId) {
  for (const step of STEPS) {
    const task = step.tasks.find((t) => t.id === taskId);
    if (task) return task as BorrowTask;
  }
  return undefined;
}

export function getStepByTaskId(taskId: TaskId) {
  return STEPS.find((step) => step.tasks.some((t) => t.id === taskId)) as BorrowStep | undefined;
}
