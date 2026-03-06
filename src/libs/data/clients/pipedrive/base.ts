import createFetchClient, { type Middleware, type Client } from "openapi-fetch";
import { z } from "zod";

const PIPEDRIVE_API_URL = process.env["PIPEDRIVE_API_URL"];
const PIPEDRIVE_API_KEY = process.env["PIPEDRIVE_API_KEY"];


export class PipedriveError extends Error {
  public readonly statusCode: number;
  public readonly errorType: string;

  constructor(errorType: string, statusCode: number, message: string) {
    super(message);
    this.name = "PipedriveError";
    this.errorType = errorType;
    this.statusCode = statusCode;
  }
}

const defaultErrorSchema = z.object({
  error: z.string(),
  statusCode: z.number().optional(),
  message: z.string().optional(),
});

export const throwMiddleware: Middleware = {
  async onResponse({ response }) {
    if (response.ok) return;

    let body: unknown;
    try {
      body = await response.json();
    } catch {
      throw new PipedriveError("UnknownError", response.status, response.statusText || "Unknown API Error");
    }

    const parsed = defaultErrorSchema.safeParse(body);

    if (parsed.success) {
      throw new PipedriveError(
        parsed.data.error,
        parsed.data.statusCode ?? response.status,
        parsed.data.message ?? parsed.data.error,
      );
    }

    throw new PipedriveError("APIError", response.status, JSON.stringify(body));
  },
};

export const authMiddleware: Middleware = {
  async onRequest({ request }) {
    request.headers.set("x-api-token", PIPEDRIVE_API_KEY!);
    return request;
  },
};

export function createPipedriveClient<T extends object>(basePath: string = ""): Client<T> {
  const client = createFetchClient<T>({
    baseUrl: `${PIPEDRIVE_API_URL}${basePath}`,
  });

  client.use(authMiddleware);
  client.use(throwMiddleware);

  return client;
}
