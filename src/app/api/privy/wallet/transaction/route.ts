import { Console } from "console";

import { AuthorizationContext, PrivyClient } from "@privy-io/node";
import { getEnvChainById, RPC_URLS } from "data/rpc";
import { NextResponse } from "next/server";
import { Address, zeroAddress } from "viem";
import { http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";
import z from "zod";

const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "";
const appSecret = process.env.PRIVY_GPULOANS_APP_SECRET ?? "";

const log = new Console({
  stdout: process.stdout,
  stderr: process.stderr,
  inspectOptions: {
    depth: null,
  },
});

// Todo: move out
const client = new PrivyClient({
  appId,
  appSecret,
  logLevel: "debug",
  logger: log,
});

const bodySchema = z.object({
  walletId: z.string(),
  walletAddress: z.string(),
  payload: z.object({
    version: z.literal(1),
    method: z.literal("POST"),
    url: z.string(),
    body: z.object({
      method: z.literal("eth_sendTransaction"),
      caip2: z.string(),
      chain_type: z.literal("ethereum"),
      sponsor: z.boolean(),
      params: z.object({
        transaction: z.object({
          to: z.string(),
          data: z.string(),
          chain_id: z.string(),
          from: z.string(),
          value: z.string(),
        }),
      }),
    }),
  }),
  signature: z.string(),
});

export async function POST(req: Request) {
  const rawBody = await req.json();
  const body = bodySchema.parse(rawBody);

  const authorizationContext: AuthorizationContext = {
    signatures: [body.signature],
  };

  const payload = body.payload;
  const tx = payload.body.params.transaction;

  const response = await client.wallets().rpc(body.walletId, {
    caip2: payload.body.caip2,
    method: payload.body.method,
    params: {
      transaction: {
        to: tx.to,
        data: tx.data,
        chain_id: tx.chain_id,
        from: tx.from,
        value: `0x${BigInt(tx.value).toString(16)}`,
      },
    },
    sponsor: payload.body.sponsor,
    authorization_context: authorizationContext,
    chain_type: "ethereum",
  });

  console.dir(response, { depth: null });

  const bundlerClient = createBundlerClient({
    chain: getEnvChainById(Number(tx.chain_id)),
    transport: http(RPC_URLS[Number(tx.chain_id)]),
  });

  const receipt = await bundlerClient.waitForUserOperationReceipt({
    hash: (response.data.user_operation_hash as Address) ?? zeroAddress, // Todo: handle userOp undefined better
  });

  return NextResponse.json({
    hash: receipt.receipt.transactionHash,
  });
}
