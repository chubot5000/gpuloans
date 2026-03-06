"use server";

import { pipedriveClientV1, PipedriveError } from "data/clients";
import { DocumentId } from "logic/pages/ApplicationPage/core/constants";
import { z } from "zod";

import { patchDeal } from "./patchDeal";

const fileUploadResponseSchema = z.object({
  success: z.boolean().optional(),
  data: z.object({ id: z.number(), name: z.string(), url: z.string().optional() }).nullable().optional(),
  error: z.string().optional(),
  error_info: z.string().optional(),
});

const fileUpdateResponseSchema = z.object({
  success: z.boolean(),
  data: z.object({ id: z.number(), description: z.string().nullable() }).nullable().optional(),
  error: z.string().optional(),
});

async function uploadPipedriveFile(formData: FormData) {
  const response = await pipedriveClientV1.POST("/files", {
    // @ts-expect-error - openapi-fetch doesn't handle FormData types well, but it works at runtime
    body: formData,
  });

  if (!response.response.ok) {
    throw new PipedriveError("File upload failed", response.response.status, response.response.statusText);
  }

  return response;
}

/**
 * Updates a file's description in Pipedrive.
 * This is used to tag files with step identifiers for later retrieval.
 */
async function updateFileDescription(fileId: number, description: string): Promise<void> {
  const response = await pipedriveClientV1.PUT("/files/{id}", {
    params: { path: { id: fileId } },
    body: { description },
  });

  if (!response.response.ok) {
    throw new PipedriveError(
      "Failed to update file description",
      response.response.status,
      response.response.statusText,
    );
  }

  const result = fileUpdateResponseSchema.parse(response.data);

  if (!result.success) {
    throw new PipedriveError("Failed to update file description", 500, result.error || "Unknown error");
  }
}

export interface UploadPipedriveDealFileParams {
  fileData: FormData;
  dealId: number;
  fieldKey: string;
  statusOptionId: number;
  /** Step identifier stored as file description for later retrieval **/
  documentId?: DocumentId;
  /** File description used to store metadata about the file **/
  description?: string;
}

export async function uploadPipedriveDealFile(params: UploadPipedriveDealFileParams) {
  const { fileData, dealId, fieldKey, statusOptionId, documentId, description } = params;

  fileData.append("deal_id", String(dealId));

  // Step 1: Upload the file
  const uploadResponse = await uploadPipedriveFile(fileData);

  const uploadResult = fileUploadResponseSchema.parse(uploadResponse.data);

  if (uploadResult.success === false || !uploadResult.data) {
    throw new PipedriveError(
      "File upload failed",
      500,
      uploadResult.error || uploadResult.error_info || "File upload failed",
    );
  }

  const fileId = uploadResult.data.id;

  // Step 2: Update the file with step ID as description
  const metadata = description || documentId;
  if (metadata) await updateFileDescription(fileId, metadata);

  // Step 3: Update the deal custom field
  await patchDeal(dealId, { custom_fields: { [fieldKey]: statusOptionId } });

  return {
    success: true,
    fileId,
    fileName: uploadResult.data.name,
    fileUrl: uploadResult.data.url,
  };
}
