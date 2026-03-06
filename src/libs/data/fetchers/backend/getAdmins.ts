import { backendClient, BackendError } from "data/clients";

export async function getAdmins() {
  const response = await backendClient.GET("/borrow/application/admins", {
    next: { revalidate: 60 * 30, tags: ["admins"] },
  });

  if (!response.data) {
    throw new BackendError("GET_ADMINS_FAILED", 500, "Failed to fetch admins");
  }

  return response.data.admins;
}
