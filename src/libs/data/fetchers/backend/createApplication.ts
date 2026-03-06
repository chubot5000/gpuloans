"use server";

import { backendClient, BackendError } from "data/clients/backend";

/**
 * Creates a new application in the backend
 * @param id - The application/deal ID to create
 * @returns The created application data
 * @throws {BackendError} If the request fails
 */
export async function createApplication(id: number) {
  const response = await backendClient.POST("/borrow/application", {
    params: {
      query: {
        applicationId: id,
      },
    },
  });

  if (!response.data) {
    throw new BackendError("CREATE_FAILED", 500, "Failed to create backend application");
  }

  return response.data;
}
