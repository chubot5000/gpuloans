import { NextRequest, NextResponse } from "next/server";

const PIPEDRIVE_API_URL = process.env["PIPEDRIVE_API_URL"];
const PIPEDRIVE_API_KEY = process.env["PIPEDRIVE_API_KEY"];

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const fileId = searchParams.get("fileId");
  const filename = searchParams.get("filename");

  if (!fileId) {
    return new NextResponse('Missing "fileId" query parameter', { status: 400 });
  }

  try {
    const response = await fetch(`${PIPEDRIVE_API_URL}/v1/files/${fileId}/download`, {
      headers: { "x-api-token": PIPEDRIVE_API_KEY! },
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch file: ${response.statusText}`, { status: response.status });
    }

    const headers = new Headers();

    if (filename) {
      headers.set("Content-Disposition", `attachment; filename="${filename}"`);
    }

    if (response.headers.get("Content-Type")) {
      headers.set("Content-Type", response.headers.get("Content-Type")!);
    }

    if (response.headers.get("Content-Length")) {
      headers.set("Content-Length", response.headers.get("Content-Length")!);
    }

    return new NextResponse(response.body, { status: 200, headers });
  } catch (error) {
    console.error("Download proxy error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}