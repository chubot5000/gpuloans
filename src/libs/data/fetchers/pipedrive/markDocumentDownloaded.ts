"use server";

import { patchDeal } from "./patchDeal";

export interface MarkDocumentDownloadedParams {
  dealId: number;
  fieldKey: string;
  downloadedStatusId: number;
}

/**
 * Marks a document as downloaded by updating the Pipedrive deal custom field
 * to the "Borrower Downloaded" status.
 */
export async function markDocumentDownloaded(params: MarkDocumentDownloadedParams) {
  const { dealId, fieldKey, downloadedStatusId } = params;

  await patchDeal(dealId, {
    custom_fields: { [fieldKey]: downloadedStatusId },
  });

  return { success: true };
}

