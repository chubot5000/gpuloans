import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({ clientId: z.string().min(1) });

export async function POST(req: NextRequest) {
  try {
    const { clientId } = requestSchema.parse(await req.json());

    const { IDENFY_API_KEY, IDENFY_API_SECRET, IDENFY_WORKFLOW_ID, IDENFY_API_URL } = process.env;
    if (!IDENFY_API_KEY || !IDENFY_API_SECRET || !IDENFY_WORKFLOW_ID || !IDENFY_API_URL) {
      return NextResponse.json({ error: "IDENFY credentials not configured" }, { status: 500 });
    }

    const auth = Buffer.from(`${IDENFY_API_KEY}:${IDENFY_API_SECRET}`).toString("base64");

    // Request token from iDenfy
    const response = await fetch(`${IDENFY_API_URL}/kyb/tokens/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Basic ${auth}` },
      body: JSON.stringify({ tokenType: "FORM", clientId, flow: IDENFY_WORKFLOW_ID }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "IDENFY API failed" }, { status: response.status });
    }

    // Parse and return token with UI URL
    const { tokenString } = z.object({ tokenString: z.string() }).parse(await response.json());

    return NextResponse.json({ tokenString, url: `https://kyb.ui.idenfy.com/welcome?authToken=${tokenString}` });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    return NextResponse.json({ error: "Failed to generate KYB token" }, { status: 500 });
  }
}
