"use server";

import { paths, pipedriveClient } from "data/clients";
import { z } from "zod";

type UpdateDealRequest = NonNullable<paths["/deals/{id}"]["patch"]["requestBody"]>["content"]["application/json"];

const patchDealSchema = z.object({
  success: z.boolean().optional(),
  data: z
    .object({
      id: z.number().optional(),
      title: z.string().optional(),
      owner_id: z.number().optional(),
      person_id: z.number().optional(),
      org_id: z.number().optional(),
      stage_id: z.number().optional(),
      pipeline_id: z.number().optional(),
      value: z.number().optional(),
      currency: z.string().optional(),
      add_time: z.string().optional(),
      update_time: z.string().nullable().optional(),
      status: z.string().optional(),
      custom_fields: z.record(z.string(), z.unknown()).optional(),
    })
    .optional(),
});

export async function patchDeal(id: number, body: UpdateDealRequest) {
  const response = await pipedriveClient.PATCH("/deals/{id}", {
    params: { path: { id } },
    body,
  });

  return patchDealSchema.parse(response.data).data;
}
