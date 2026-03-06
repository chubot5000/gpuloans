"use server";

import { pipedriveClientV1, PipedriveError } from "data/clients";
import { z } from "zod";

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

export interface AllDealFilesResult {
  files: Array<{
    id: number;
    name: string;
    file_name: string;
    downloadUrl: string;
    add_time?: string;
    file_type?: string;
  }>;
}

export async function getAllDealFiles(dealId: number): Promise<AllDealFilesResult> {
  const response = await pipedriveClientV1.GET("/deals/{id}/files", {
    params: { path: { id: dealId }, query: { sort: "add_time" } },
    next: { revalidate: 60 },
  });

  if (!response.response.ok) {
    throw new PipedriveError("Failed to get deal files", response.response.status, response.response.statusText);
  }

  const result = dealFilesResponseSchema.parse(response.data);

  if (!result.success || !result.data) return { files: [] };

  const files = result.data.map((file) => ({
    id: file.id,
    name: file.name,
    file_name: file.file_name,
    downloadUrl: `/api/download-proxy?fileId=${file.id}`,
    add_time: file.add_time,
    file_type: file.file_type,
  }));

  return { files };
}
