"use server";

import { AuthorizationContext } from "@privy-io/node";
import { WriteContractParameters } from "@wagmi/core";
import { privyClient } from "data/clients/privy";
import { getEnvChainById, RPC_URLS } from "data/rpc";
import { Address, encodeFunctionData } from "viem";
import { http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";

interface SendPrivyTransactionParams {
  txParams: WriteContractParameters;
  signature: string;
  walletId: string;
}

export async function sendPrivyTransaction(params: SendPrivyTransactionParams) {
  const { txParams, signature, walletId } = params;
  const walletAddress = typeof txParams.account === "string" ? txParams.account : txParams.account?.address;

  if (!walletAddress) throw new Error("Wallet address is required");

  const authorizationContext: AuthorizationContext = {
    signatures: [signature],
  };

  const txData = encodeFunctionData({
    abi: txParams.abi,
    functionName: txParams.functionName,
    args: txParams.args,
  });

  console.log({
    functionName: txParams.functionName,
    to: txParams.address,
    args: txParams.args,
    chain_id: txParams.chainId,
    from: walletAddress,
    value: txParams.value,
  });

  const response = await privyClient
    .wallets()
    .ethereum()
    .sendTransaction(walletId, {
      caip2: `eip155:${txParams.chainId}`,
      params: {
        transaction: {
          to: txParams.address,
          data: txData,
          chain_id: `0x${txParams.chainId?.toString(16) ?? "0"}`,
          from: walletAddress,
          value: `0x${txParams.value?.toString(16) ?? "0"}`,
        },
      },
      sponsor: true,
      authorization_context: authorizationContext,
    });

  console.dir(response, { depth: null });

  const bundlerClient = createBundlerClient({
    chain: getEnvChainById(Number(txParams.chainId)),
    transport: http(RPC_URLS[Number(txParams.chainId)]),
  });

  const hash =
    (response.hash as Address) ||
    (await bundlerClient
      .waitForUserOperationReceipt({
        hash: response.user_operation_hash as Address,
      })
      .then((receipt) => receipt.receipt.transactionHash));

  return {
    hash,
  };
}
