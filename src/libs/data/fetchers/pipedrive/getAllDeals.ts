"use server";

import { pipedriveClientV1 } from "data/clients";
import { CUSTOM_FIELD_KEYS, STAGES, STAGES_LABELS, STAGES_ORDER } from "data/clients/pipedrive/constants.generated";
import { compact } from "lodash";

export interface GetAllDealsParams {
  stageId?: STAGES;
}

export async function getAllDeals(params?: GetAllDealsParams) {
  const { stageId } = params || {};

  const { data } = await pipedriveClientV1.GET("/deals", {
    params: {
      query: {
        limit: 500,
        status: "all_not_deleted",
        sort_by: "add_time",
        sort_direction: "asc",
        ...(stageId !== undefined && { stage_id: stageId }),
      },
    },
  });

  if (!data?.data) return [];

  const deals = data.data.map((deal) => {
    if (!deal.person_id || !deal.id || !deal.status || !deal.add_time || !deal.title || !deal.stage_id) return null;

    const raw = deal as Record<string, unknown>;

    return {
      id: deal.id,
      status: deal.status,
      add_time: deal.add_time,
      title: deal.title,
      stage_id: deal.stage_id as STAGES,
      stage_label: STAGES_LABELS[deal.stage_id as STAGES] || "Unknown",
      person_id: deal.person_id?.value ?? null,
      person_name: deal.person_id?.name ?? null,
      is_test: raw[CUSTOM_FIELD_KEYS.ISTEST] === 153, // 153 = "Yes" for isTEST
      custom_fields: {
        gpuType: (raw[CUSTOM_FIELD_KEYS.CHIP_SERVER_TYPE] ?? null) as string | null,
      },
    };
  });

  const stageOrderMap = new Map(STAGES_ORDER.map((stage, index) => [stage, index]));

  const sortedDeals = compact(deals).sort((a, b) => {
    const orderA = stageOrderMap.get(a.stage_id) ?? -1;
    const orderB = stageOrderMap.get(b.stage_id) ?? -1;

    return orderB - orderA;
  });

  return sortedDeals;
}

export type AllDeals = Awaited<ReturnType<typeof getAllDeals>>[number];
