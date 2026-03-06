import { NextResponse } from "next/server";

import { getEnvChainById } from "./chains";
import { RPC_URLS } from "./rpcUrls";

export async function POST(req: Request) {
  const chainId = Number(req.headers.get("chainid"));
  const chain = getEnvChainById(chainId);
  if (!chain) return new NextResponse("Invalid chain id", { status: 400 });

  const body = await req.text();

  const chainUrl = RPC_URLS[chainId];

  const response = await fetch(chainUrl, { method: "POST", body });

  const json = await response.json();

  return NextResponse.json(json, { status: response.status });
}
