"use server";

import { pipedriveClientV1, PipedriveError } from "data/clients";
import { DocumentId } from "logic/pages";
import { z } from "zod";

const ParsedStringSchema = z.object({
  version: z.string().min(1),
  owner: z.enum(["user", "admin"]),
});

// Create a transformer schema that splits the string and pipes it
// into the object schema for validation.
const IdStringSchema = z
  .string()
  .transform((val, ctx) => {
    const parts = val.split("_");
    if (parts.length !== 3) {
      ctx.addIssue({
        code: "invalid_format",
        message: "Description must have format: stepId_version_owner",
        format: "stepId_version_owner",
      });
      return z.NEVER;
    }
    return {
      version: parts[1].toLowerCase(),
      owner: parts[2].toLowerCase(),
    };
  })
  .pipe(ParsedStringSchema);

const pipedriveFileSchema = z.object({
  id: z.number(),
  file_name: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  url: z.string().nullable().optional(),
  add_time: z.string().optional(),
  update_time: z.string().nullable().optional(),
  file_type: z.string().optional(),
  file_size: z.number().optional(),
  active_flag: z.boolean().optional(),
});

const dealFilesResponseSchema = z.object({
  success: z.boolean(),
  data: z.array(pipedriveFileSchema).nullable().optional(),
  additional_data: z
    .object({
      pagination: z
        .object({
          start: z.number(),
          limit: z.number(),
          more_items_in_collection: z.boolean(),
          next_start: z.number().optional(),
        })
        .optional(),
    })
    .optional(),
});

type PipedriveFileRaw = z.infer<typeof pipedriveFileSchema>;

export interface PipedriveFile extends PipedriveFileRaw {
  downloadUrl: string;
  documentId: DocumentId;
  version?: string;
  owner?: "user" | "admin";
}

export interface GetDealFilesParams {
  dealId: number;
  documentId: DocumentId;
}

export interface DealFilesResult {
  files: PipedriveFile[];
}

export async function getDealFiles(params: GetDealFilesParams) {
  const { dealId, documentId: filterDocumentId } = params;

  const response = await pipedriveClientV1.GET("/deals/{id}/files", {
    params: { path: { id: dealId }, query: { sort: "add_time" } },
    next: { revalidate: 60 },
  });

  if (!response.response.ok) {
    throw new PipedriveError("Failed to get deal files", response.response.status, response.response.statusText);
  }

  const result = dealFilesResponseSchema.parse(response.data);

  if (!result.success || !result.data) return { files: [] };

  let files: PipedriveFile[] = result.data.map((file) => {
    const parsed = IdStringSchema.safeParse(file.description);

    const baseFile = {
      ...file,
      downloadUrl: `/api/download-proxy?fileId=${file.id}`,
      documentId: filterDocumentId,
    };

    if (parsed.success) {
      return { ...baseFile, version: parsed.data.version, owner: parsed.data.owner };
    }

    return baseFile;
  });

  if (filterDocumentId) files = files.filter((file) => file.description?.startsWith(filterDocumentId));

  return { files };
}

export async function getTaskFile(dealId: number, documentId: DocumentId) {
  const { files } = await getDealFiles({ dealId, documentId });

  return files;
}
