import assert from "assert";

import { PrivyPoliciesService, PrivyWalletsService } from "@privy-io/node";

export async function createWalletUpdateIntent(walletId: string, body: PrivyWalletsService.UpdateInput) {
  const url = `https://api.privy.io/v1/apps/${appId}/intents/wallets/${walletId}`;
  return sendPrivyApiRequest(url, body);
}

export async function createPolicyUpdateIntent(policyId: string, body: PrivyPoliciesService.UpdateInput) {
  const url = `https://api.privy.io/v1/apps/${appId}/intents/policies/${policyId}`;
  return sendPrivyApiRequest(url, body);
}

export async function sendPrivyApiRequest(url: string, body: object) {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${appId}:${appSecret}`).toString("base64")}`,
      "privy-app-id": appId,
    },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  console.log(data);
  return data;
}

assert(process.env.NEXT_PUBLIC_PRIVY_APP_ID, "NEXT_PUBLIC_PRIVY_APP_ID is not set");
assert(process.env.PRIVY_GPULOANS_APP_SECRET, "PRIVY_GPULOANS_APP_SECRET is not set");
const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;
const appSecret = process.env.PRIVY_GPULOANS_APP_SECRET;
