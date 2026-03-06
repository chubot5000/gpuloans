"use server";

import { AuthorizationContext } from "@privy-io/node";
import { privyClient } from "data/clients/privy";

interface SignPrivyMessageParams {
  message: string;
  signature: string;
  walletId: string;
}

export async function signPrivyMessage(params: SignPrivyMessageParams) {
  const { message, walletId, signature } = params;

  const authorizationContext: AuthorizationContext = {
    signatures: [signature],
  };

  const response = await privyClient.wallets().ethereum().signMessage(walletId, {
    message: message,
    authorization_context: authorizationContext,
  });

  return response.signature;
}
