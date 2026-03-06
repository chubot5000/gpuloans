"use server";

import { pipedriveClient } from "data/clients";
import { z } from "zod";

const searchResponseSchema = z.object({
  data: z
    .object({
      items: z.array(
        z.object({
          item: z.object({
            id: z.number(),
            name: z.string(),
          }),
        }),
      ),
    })
    .optional(),
});

export async function searchPersonByEmail(email: string) {
  if (!email?.trim()) {
    return { exists: false };
  }

  const response = await pipedriveClient.GET("/persons/search", {
    params: {
      query: {
        term: email.trim(),
        fields: "email",
        exact_match: true,
        limit: 1,
      },
    },
  });

  const parsed = searchResponseSchema.safeParse(response.data);
  const item = parsed.success ? parsed.data.data?.items?.[0]?.item : null;

  if (item) return { exists: true, personId: item.id, name: item.name };

  return { exists: false };
}
