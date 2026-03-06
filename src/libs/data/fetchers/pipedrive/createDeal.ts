"use server";

import { paths, pipedriveClient, PipedriveError } from "data/clients";

type CreateDealRequest = NonNullable<paths["/deals"]["post"]["requestBody"]>["content"]["application/json"];

type CreateDealResponse = NonNullable<
  paths["/deals"]["post"]["responses"]["200"]["content"]["application/json"]
>["data"] & { id: number };

/**
 * Creates a new deal in Pipedrive
 * @param dealData - The deal data to create
 * @returns The created deal data with guaranteed id
 * @throws {PipedriveError} If the request fails or response is invalid
 */
export async function createPipedriveDeal(dealData: CreateDealRequest): Promise<CreateDealResponse> {
  const response = await pipedriveClient.POST("/deals", {
    body: dealData,
  });

  const data = response.data?.data;

  if (!data || typeof data.id !== "number") {
    const statusCode = response.response?.status || 500;
    throw new PipedriveError("CREATE_FAILED", statusCode, "Failed to create deal: Invalid or missing ID in response");
  }

  return data as CreateDealResponse;
}
