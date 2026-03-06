import { createQuoteRequest } from "data/fetchers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await createQuoteRequest(body);
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error creating quote request:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to create quote request",
      },
      { status: 500 },
    );
  }
}
