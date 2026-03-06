import { OEM_PAYMENT_TERMS } from "data/clients/pipedrive/constants.generated";
import { StepState } from "logic/index";

export const KYB_MESSAGES: Partial<Record<StepState, string>> = {
  PENDING: "Your KYB/AML information is being reviewed.",
  COMPLETED: "KYB/AML information has been approved.",
};

export const PO_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Upload the purchase order from the Original Equipment Manufacturer (OEM).",
  PENDING: "Your purchase order is being reviewed.",
  COMPLETED: "Purchase order signed successfully.",
  UW_COMMENTS: "Please review the purchase order and address any comments.",
  REJECTED: "Purchase order was rejected. Please upload a new document.",
};

export const NET30_OPTIONS = [
  { label: "Yes", value: String(OEM_PAYMENT_TERMS.Net30) },
  { label: "No", value: String(OEM_PAYMENT_TERMS.No) },
];

export const COLOCATION_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Upload your executed colocation agreement with the datacenter operator.",
  PENDING: "Your colocation agreement is being reviewed.",
  UNAVAILABLE: "This step is not yet available.",
  UW_COMMENTS: "The underwriter has comments on your colocation agreement. Please review and re-upload.",
  REJECTED: "Your colocation agreement was rejected. Please upload a new document.",
};

export const ONE_PAGER_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Upload your datacenter one-pager documentation.",
  PENDING: "Your datacenter one-pager is being reviewed.",
  UW_COMMENTS: "The underwriter has comments on your datacenter one-pager. Please review and re-upload.",
  REJECTED: "Your datacenter one-pager was rejected. Please upload a new document.",
};

export const EXECUTED_OFFTAKE_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Upload your executed offtake agreement or letter of intent (LOI).",
  PENDING: "Your offtake agreement is being reviewed.",
  UW_COMMENTS: "The underwriter has comments on your offtake agreement. Please review and re-upload.",
  REJECTED: "Your offtake agreement was rejected. Please upload a new document.",
};

export const LEGAL_REVIEW_MESSAGES: Partial<Record<StepState, string>> = {
  TODO: "Start the legal review process for your jurisdiction.",
  PENDING:
    "GPULoans will conduct a legal review of any country outside of the United States. If your country has been approved, this step will be marked Complete (green text). If not, we will contact you to discuss next steps.",
  COMPLETED: "Legal review has been completed for your jurisdiction.",
  REJECTED: "Legal review has been rejected for your jurisdiction. Please contact support for assistance.",
};
