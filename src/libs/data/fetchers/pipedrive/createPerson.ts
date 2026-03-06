"use server";

import { paths, pipedriveClient, PipedriveError } from "data/clients";

type CreatePersonRequest = NonNullable<paths["/persons"]["post"]["requestBody"]>["content"]["application/json"];

type CreatePersonResponse = NonNullable<
  paths["/persons"]["post"]["responses"]["200"]["content"]["application/json"]
>["data"] & { id: number };

type CreatePersonResult = {
  data: CreatePersonResponse;
  created: boolean;
};

type CreatePersonOptions = {
  forceCreate?: boolean;
};

/**
 * Creates a new person in Pipedrive (or returns existing if found by email)
 * @param personData - The person data to create
 * @param options - Options for creation behavior
 * @param options.forceCreate - If true, always creates a new person. Default: false
 * @returns The created or existing person data with guaranteed id, and whether it was newly created
 * @throws {PipedriveError} If the request fails or response is invalid
 */
export async function createPipedrivePerson(
  personData: CreatePersonRequest,
  options: CreatePersonOptions = {},
): Promise<CreatePersonResult> {
  const { forceCreate = false } = options;

  if (!forceCreate && personData.emails?.length) {
    const primaryEmail = personData.emails.find((e) => e.primary)?.value ?? personData.emails[0]?.value;

    if (primaryEmail) {
      const searchResponse = await pipedriveClient.GET("/persons/search", {
        params: {
          query: {
            term: primaryEmail,
            fields: "email",
            exact_match: true,
            limit: 1,
          },
        },
      });

      const existingItem = searchResponse.data?.data?.items?.[0]?.item;
      if (existingItem && typeof existingItem.id === "number" && typeof existingItem.name === "string") {
        return {
          data: { id: existingItem.id, name: existingItem.name } as CreatePersonResponse,
          created: false,
        };
      }
    }
  }

  const response = await pipedriveClient.POST("/persons", {
    body: personData,
  });

  const data = response.data?.data;

  if (!data || typeof data.id !== "number") {
    const statusCode = response.response?.status || 500;
    throw new PipedriveError("CREATE_FAILED", statusCode, "Failed to create person: Invalid or missing ID in response");
  }

  return { data: data as CreatePersonResponse, created: true };
}
