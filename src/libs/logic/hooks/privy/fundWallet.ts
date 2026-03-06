"use server";

import assert from "assert";

import { privyClient as client } from "data/clients/privy";
import { getEnvChainById, RPC_URLS } from "data/rpc";
import { Address, http } from "viem";
import { createBundlerClient } from "viem/account-abstraction";

interface FundWalletParams {
  address: Address;
  amount: bigint;
  chainId: number;
}

assert(process.env.NEXT_PUBLIC_PRIVY_FUND_WALLET_ID, "NEXT_PUBLIC_PRIVY_FUND_WALLET_ID is not set");
const walletId = process.env.NEXT_PUBLIC_PRIVY_FUND_WALLET_ID;
export async function fundWallet(params: FundWalletParams) {
  // Add more validation in case fund wallet started to hold higher balance
  const { address, amount, chainId } = params;

  const response = await client
    .wallets()
    .ethereum()
    .sendTransaction(walletId, {
      caip2: `eip155:${chainId}`,
      params: {
        transaction: {
          to: address,
          value: `0x${amount.toString(16)}`,
          chain_id: `0x${chainId.toString(16)}`,
        },
      },
    });

  const bundlerClient = createBundlerClient({
    chain: getEnvChainById(Number(chainId)),
    transport: http(RPC_URLS[Number(chainId)]),
  });

  const hash =
    (response.hash as Address) ||
    (await bundlerClient
      .waitForUserOperationReceipt({
        hash: response.user_operation_hash as Address,
      })
      .then((receipt) => receipt.receipt.transactionHash));

  return hash;
}
