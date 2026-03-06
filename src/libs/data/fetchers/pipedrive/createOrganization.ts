"use server";

import { paths, pipedriveClient, PipedriveError } from "data/clients";

type CreateOrganizationRequest = NonNullable<
  paths["/organizations"]["post"]["requestBody"]
>["content"]["application/json"];

type CreateOrganizationResponse = NonNullable<
  paths["/organizations"]["post"]["responses"]["200"]["content"]["application/json"]
>["data"] & { id: number };

type CreateOrganizationResult = {
  data: CreateOrganizationResponse;
  created: boolean;
};

type CreateOrganizationOptions = {
  forceCreate?: boolean;
};

/**
 * Creates a new organization in Pipedrive (or returns existing if found by name)
 * @param organizationData - The organization data to create
 * @param options - Options for creation behavior
 * @param options.forceCreate - If true, always creates a new organization. Default: false
 * @returns The created or existing organization data with guaranteed id, and whether it was newly created
 * @throws {PipedriveError} If the request fails or response is invalid
 */
export async function createPipedriveOrganization(
  organizationData: CreateOrganizationRequest,
  options: CreateOrganizationOptions = {},
): Promise<CreateOrganizationResult> {
  const { forceCreate = false } = options;

  if (!forceCreate && organizationData.name) {
    const searchResponse = await pipedriveClient.GET("/organizations/search", {
      params: {
        query: {
          term: organizationData.name,
          fields: "name",
          exact_match: true,
          limit: 1,
        },
      },
    });

    const existingItem = searchResponse.data?.data?.items?.[0]?.item;
    if (existingItem?.id && existingItem?.name) {
      return {
        data: { id: existingItem.id, name: existingItem.name } as CreateOrganizationResponse,
        created: false,
      };
    }
  }

  const response = await pipedriveClient.POST("/organizations", {
    body: organizationData,
  });

  const data = response.data?.data;

  if (!data || typeof data.id !== "number") {
    const statusCode = response.response?.status || 500;
    throw new PipedriveError(
      "CREATE_FAILED",
      statusCode,
      "Failed to create organization: Invalid or missing ID in response",
    );
  }

  return { data: data as CreateOrganizationResponse, created: true };
}
