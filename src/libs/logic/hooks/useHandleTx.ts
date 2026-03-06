"use client";

import { type TransactionReceipt, type WriteContractReturnType } from "viem";

import { TxStep } from "./useTxSteps";

export type TxConfirmCallback = (receipt: TransactionReceipt | undefined) => Promise<void> | void;

interface HandleTransactionParams {
  title: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
  updateStep: (updates: Partial<TxStep>) => void;
  beforeSigning?: () => Promise<void> | void;
  afterSigning?: (txHash: WriteContractReturnType | undefined) => Promise<void> | void;
  afterConfirming?: TxConfirmCallback;
  confirmations?: number;
}

export function useHandleTx() {
  return async function handleTx(_params: HandleTransactionParams): Promise<void> {
    console.warn("Wallet functionality is disabled");
  };
}
