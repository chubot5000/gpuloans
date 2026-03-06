import {
  WAREHOUSERECEIPT_STATUS,
  LLC_AGREEMENT,
  NDA_STATUS,
  TERMSHEET_STATUS,
  CUSTOMERSERVICEAGREEMENT_STATUS,
  SALEANDCONTRIBUTIONAGREEMENT_STATUS,
  SPVONESTOP_STATUS,
} from "data/clients/pipedrive/constants.generated";
import { CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import type { DealDetail } from "data/fetchers";

import { DocumentId, TaskId } from "../core/constants";

export interface TemplateDoc {
  stepId: TaskId;
  docURLs: string[];
  fieldKey: string;
  underReviewStatusId: number;
  approvedStatusId: number;
  uwCommentsStatusId: number;
  rejectedStatusId: number;
  documentName: string;
}

export const TEMPLATES_DOCS: Partial<Record<TaskId, TemplateDoc>> = {
  [TaskId.TERM_SHEET]: {
    stepId: TaskId.TERM_SHEET,
    docURLs: [
      "https://docs.google.com/document/d/1SRI9ACVsEVF7z_ggLOLVcZXkWVGOJ2N8/edit?usp=drive_link&ouid=113360448311435213108&rtpof=true&sd=true", // Non-US
      "https://docs.google.com/document/d/1AFuEILVs2e5roTaaXvdZdubrtf37KZCO/edit?usp=drive_link&ouid=113360448311435213108&rtpof=true&sd=true", // US
    ],
    fieldKey: CUSTOM_FIELD_KEYS.TERMSHEET_STATUS,
    underReviewStatusId: TERMSHEET_STATUS["Needs Review"],
    approvedStatusId: TERMSHEET_STATUS["Borrower Signed"],
    uwCommentsStatusId: TERMSHEET_STATUS["Needs Review"],
    rejectedStatusId: TERMSHEET_STATUS["Needs Review"],
    documentName: "Term Sheet",
  },
  [TaskId.NDA]: {
    stepId: TaskId.NDA,
    docURLs: [
      "https://powerforms.docusign.net/dabb17c3-1438-43de-971e-26ed6c806bdb?env=na4&acct=a9d5bd50-d34c-437d-995b-4db6fbdb0454&accountId=a9d5bd50-d34c-437d-995b-4db6fbdb0454",
      "https://drive.google.com/uc?export=download&id=1A4vw-g9ZpLix7EIi4d4X4r-CANQ67lDW",
    ],
    fieldKey: CUSTOM_FIELD_KEYS.NDA_STATUS,
    underReviewStatusId: NDA_STATUS["Needs Review"],
    approvedStatusId: NDA_STATUS["Borrower Signed"],
    uwCommentsStatusId: NDA_STATUS["Needs Review"],
    rejectedStatusId: NDA_STATUS["Needs Review"],
    documentName: "Mutual Non-Disclosure Agreement",
  },
  [TaskId.WAREHOUSE]: {
    stepId: TaskId.WAREHOUSE,
    docURLs: ["https://docs.google.com/document/d/1bViluZjjRdY8nXre6rVP_SK6tYSKq1ki"],
    fieldKey: CUSTOM_FIELD_KEYS.WAREHOUSERECEIPT_STATUS,
    underReviewStatusId: WAREHOUSERECEIPT_STATUS["Under Review"],
    approvedStatusId: WAREHOUSERECEIPT_STATUS["Approved"],
    uwCommentsStatusId: WAREHOUSERECEIPT_STATUS["UW Comments"],
    rejectedStatusId: WAREHOUSERECEIPT_STATUS["Rejected"],
    documentName: "GPU Electronic Warehouse Receipt",
  },
  [TaskId.CSA]: {
    stepId: TaskId.CSA,
    docURLs: ["https://docs.google.com/document/d/1EYt1xOhEjkEJtcKDeBLI59lLYDl59MfF"],
    fieldKey: CUSTOM_FIELD_KEYS.CUSTOMERSERVICEAGREEMENT_STATUS,
    underReviewStatusId: CUSTOMERSERVICEAGREEMENT_STATUS["Under Review"],
    approvedStatusId: CUSTOMERSERVICEAGREEMENT_STATUS["Approved"],
    uwCommentsStatusId: CUSTOMERSERVICEAGREEMENT_STATUS["UW Comments"],
    rejectedStatusId: CUSTOMERSERVICEAGREEMENT_STATUS["Rejected"],
    documentName: "Customer Services Agreement",
  },
  [TaskId.SALE_AGREEMENT]: {
    stepId: TaskId.SALE_AGREEMENT,
    docURLs: ["https://docs.google.com/document/d/1iuOqCVQhYAAHcQiX_XMxEUWNpxdqAgYA"],
    fieldKey: CUSTOM_FIELD_KEYS.SALEANDCONTRIBUTIONAGREEMENT_STATUS,
    underReviewStatusId: SALEANDCONTRIBUTIONAGREEMENT_STATUS["Under Review"],
    approvedStatusId: SALEANDCONTRIBUTIONAGREEMENT_STATUS["Approved"],
    uwCommentsStatusId: SALEANDCONTRIBUTIONAGREEMENT_STATUS["UW Comments"],
    rejectedStatusId: SALEANDCONTRIBUTIONAGREEMENT_STATUS["Rejected"],
    documentName: "Sale and Contribution Agreement",
  },
  [TaskId.SPV_LLC_FORMATION]: {
    stepId: TaskId.SPV_LLC_FORMATION,
    docURLs: ["https://docs.google.com/document/d/1rf1pVkP5PUSnsrixmSicYjS7Ca6s6uUB"],
    fieldKey: CUSTOM_FIELD_KEYS.LLC_AGREEMENT,
    underReviewStatusId: LLC_AGREEMENT["Under Review"],
    approvedStatusId: LLC_AGREEMENT["Approved"],
    uwCommentsStatusId: LLC_AGREEMENT["UW Comments"],
    rejectedStatusId: LLC_AGREEMENT["Rejected"],
    documentName: "LLC Agreement",
  },
  [TaskId.EXECUTED_SPV_LLC_DOCUMENTS]: {
    stepId: TaskId.EXECUTED_SPV_LLC_DOCUMENTS,
    docURLs: [
      "https://drive.google.com/uc?export=download&id=1I27V20jYQbDvdtCYg5LRe_b_EO6UyWeL", // SPV LLC Formation
    ],
    fieldKey: CUSTOM_FIELD_KEYS.SPVONESTOP_STATUS,
    underReviewStatusId: SPVONESTOP_STATUS["Under Review"],
    approvedStatusId: SPVONESTOP_STATUS["Approved"],
    uwCommentsStatusId: SPVONESTOP_STATUS["Under Review"],
    rejectedStatusId: SPVONESTOP_STATUS["Under Review"],
    documentName: "SPV LLC Formation Documents",
  },
};

// Certificate of Formation
// Formation Evidence
// Approval of RA and IM
// LLC Agreement
// Contact Information Request

export const SPV_DOCUMENTS = [
  {
    id: DocumentId.CERTIFICATE_OF_FORMATION,
    name: "Certificate of Formation",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1I27V20jYQbDvdtCYg5LRe_b_EO6UyWeL",
    viewUrl: "https://docs.google.com/document/d/1I27V20jYQbDvdtCYg5LRe_b_EO6UyWeL",
  },
  {
    id: DocumentId.FORMATION_EVIDENCE,
    name: "Formation Evidence",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ROL_t_G9CVs-uSGzCTMVtvXJYTPKDRuw",
    viewUrl: "https://docs.google.com/document/d/1ROL_t_G9CVs-uSGzCTMVtvXJYTPKDRuw",
  },
  {
    id: DocumentId.APPROVAL_RA_IM,
    name: "Approval of RA and IM",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1cQtyke_XJV27kSL8qHE-2D-kl52rIpXO",
    viewUrl: "https://docs.google.com/document/d/1cQtyke_XJV27kSL8qHE-2D-kl52rIpXO",
  },
  {
    id: DocumentId.LLC_AGREEMENT,
    name: "LLC Agreement",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ROL_t_G9CVs-uSGzCTMVtvXJYTPKDRuw",
    viewUrl: "https://docs.google.com/document/d/1ROL_t_G9CVs-uSGzCTMVtvXJYTPKDRuw",
  },
  {
    id: DocumentId.CONTACT_INFORMATION,
    name: "Contact Information Request",
    downloadUrl: "https://drive.google.com/uc?export=download&id=1ZjnL0nXkNuos7f4B1m9tlwgRNzWQtbik",
    viewUrl: "https://docs.google.com/document/d/1ZjnL0nXkNuos7f4B1m9tlwgRNzWQtbik",
  },
];

/**
 * Gets the template URLs for a given task, using override from Pipedrive if available
 * @param taskId - The task ID to get template URLs for
 * @param dealDetail - Optional deal detail containing override URLs
 * @returns Array of template URLs (override if available, otherwise default)
 */
export function getTemplateURLs(taskId: TaskId, dealDetail?: DealDetail | null): string[] {
  const config = TEMPLATES_DOCS[taskId];
  if (!config) return [];

  let override;
  switch (taskId) {
    case TaskId.TERM_SHEET:
      override = dealDetail?.custom_fields?.termSheetOverride;
      break;
    case TaskId.NDA:
      override = dealDetail?.custom_fields?.ndaOverride;
      break;
    case TaskId.CSA:
      override = dealDetail?.custom_fields?.customerServiceAgreementOverride;
      break;
    case TaskId.SALE_AGREEMENT:
      override = dealDetail?.custom_fields?.saleAndContributionAgreementOverride;
      break;
    default:
      override = null;
  }

  if (override?.trim()) {
    const parsedUrls = override
      .split(/[,\n]/)
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    if (parsedUrls.length > 0) return parsedUrls;
  }

  return config.docURLs;
}
