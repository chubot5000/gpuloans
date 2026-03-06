"use server";

import { pipedriveClient, pipedriveClientV1 } from "data/clients";
import { CUSTOM_FIELD_KEYS, STAGES, STAGES_LABELS } from "data/clients/pipedrive/constants.generated";
import { z } from "zod";

const personSearchResultSchema = z.object({
  items: z.array(
    z.object({
      item: z.object({
        id: z.number(),
        name: z.string(),
      }),
    }),
  ),
});

const dealSchema = z
  .object({
    id: z.number(),
    status: z.string(),
    add_time: z.string(),
    title: z.string(),
    stage_id: z.number(),
    person_id: z.object({ value: z.number() }).nullable(),
    person_name: z.string().nullable(),
    [CUSTOM_FIELD_KEYS.CHIP_SERVER_TYPE]: z.string().nullable().optional(),
  })
  .transform((deal) => ({
    id: deal.id,
    status: deal.status,
    addTime: deal.add_time,
    title: deal.title,
    stageId: deal.stage_id as STAGES,
    stageLabel: STAGES_LABELS[deal.stage_id as STAGES] ?? "Unknown",
    personId: deal.person_id?.value ?? null,
    personName: deal.person_name,
    gpuType: deal[CUSTOM_FIELD_KEYS.CHIP_SERVER_TYPE] ?? null,
  }));

export type AccountDeal = z.infer<typeof dealSchema>;

export interface AccountDealsResponse {
  deals: AccountDeal[];
  personName: string;
}

interface GetAccountDealsParams {
  email: string;
}

async function findPersonByEmail(email: string) {
  const { data } = await pipedriveClient.GET("/persons/search", {
    params: { query: { term: email, fields: "email", exact_match: true } },
  });

  const result = personSearchResultSchema.safeParse(data?.data);
  if (!result.success || result.data.items.length === 0) {
    return null;
  }

  return result.data.items[0].item;
}

async function fetchPersonDeals(personId: number) {
  const { data } = await pipedriveClientV1.GET("/persons/{id}/deals", {
    params: {
      path: { id: personId },
      query: { status: "all_not_deleted" },
    },
    next: { revalidate: 5 * 60 },
  });

  return z.array(dealSchema).parse(data?.data ?? []);
}

export async function getAccountDeals(params: GetAccountDealsParams): Promise<AccountDealsResponse | null> {
  const { email } = z.object({ email: z.email() }).parse(params);

  const person = await findPersonByEmail(email);

  if (!person) return null;

  const deals = await fetchPersonDeals(person.id);

  return { deals, personName: person.name };
}
