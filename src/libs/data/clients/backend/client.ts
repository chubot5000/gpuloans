import createFetchClient, { type Middleware } from "openapi-fetch";
import { z } from "zod";

import type { paths } from "./schema";

export const BACKEND_API_URL = process.env["NEXT_PUBLIC_BACKEND_API_URL"];

export class BackendError extends Error {
  error: string;

  statusCode: number;

  override message: string;

  constructor(error: string, statusCode: number, message: string) {
    super();
    this.error = error;
    this.statusCode = statusCode;
    this.message = message;
  }
}

const defaultErrorSchema = z.object({
  error: z.string(),
  statusCode: z.number(),
  message: z.string(),
});

const throwMiddleware: Middleware = {
  async onResponse({ response }) {
    if (!response.ok) {
      const body = await response.json();
      const error = defaultErrorSchema.safeParse(body);
      if (error.success) throw new BackendError(error.data.error, error.data.statusCode, error.data.message);

      throw new BackendError(response.statusText, response.status, response.statusText);
    }
  },
};

export const backendClient = createFetchClient<paths>({
  baseUrl: BACKEND_API_URL,
  credentials: "include",
});

backendClient.use(throwMiddleware);
