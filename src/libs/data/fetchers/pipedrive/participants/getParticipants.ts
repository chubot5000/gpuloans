"use server";

import { pipedriveClientV1 } from "data/clients";
import { z } from "zod";

const responseSchema = z.object({
  data: z
    .array(
      z.object({
        id: z.number(),
        person_id: z
          .object({
            value: z.number().optional(),
            name: z.string().optional(),
            email: z.array(z.object({ value: z.string().optional(), primary: z.boolean().optional() })).optional(),
          })
          .nullable()
          .optional(),
        add_time: z.string().optional(),
        active_flag: z.boolean().optional(),
      }),
    )
    .optional(),
});

export interface Participant {
  id: number;
  personId: number;
  name: string;
  email: string | null;
  addTime: string;
  activeFlag: boolean;
}

export async function getParticipants(dealId: number) {
  const response = await pipedriveClientV1.GET("/deals/{id}/participants", {
    params: { path: { id: dealId } },
  });

  const parsed = responseSchema.safeParse(response.data);
  if (!parsed.success || !parsed.data.data) return [];

  return parsed.data.data.map((p) => ({
    id: p.id,
    personId: p.person_id?.value ?? 0,
    name: p.person_id?.name ?? "Unknown",
    email: p.person_id?.email?.find((e) => e.primary)?.value ?? p.person_id?.email?.[0]?.value ?? null,
    addTime: p.add_time ?? "",
    activeFlag: p.active_flag ?? true,
  }));
}
