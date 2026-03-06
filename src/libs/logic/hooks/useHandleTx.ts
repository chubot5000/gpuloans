"use client";

import { usePrivy } from "@privy-io/react-auth";
import {
  waitForTransactionReceipt,
  writeContract,
  type WriteContractParameters,
  sendTransaction as sendTransactionWagmi,
} from "@wagmi/core";
import { SIGNER_CONNECTOR_ID, useWeb3 } from "logic/components";
import { type Address, type Hex, type TransactionReceipt, type WriteContractReturnType } from "viem";
import { useChainId, useConfig, usePublicClient, useSwitchChain, useWalletClient } from "wagmi";

import { usePrivySignerTxs } from "./privy";
import { TxStep } from "./useTxSteps";

export type TxConfirmCallback = (receipt: TransactionReceipt | undefined) => Promise<void> | void;

interface HandleTransactionParams {
  title: string;
  params: WriteContractParameters | SendTransactionParams | undefined;
  updateStep: (updates: Partial<TxStep>) => void;
  beforeSigning?: () => Promise<void> | void;
  afterSigning?: (txHash: WriteContractReturnType | undefined) => Promise<void> | void;
  afterConfirming?: TxConfirmCallback;
  confirmations?: number;
}

interface SendTransactionParams {
  chainId: number;
  to: Address;
  data: Hex;
  value: bigint;
}

export function useHandleTx() {
  const wagmiChainId = useChainId();
  const {
    account: { connector },
  } = useWeb3();
  const { mutateAsync: switchChainAsync } = useSwitchChain();
  const config = useConfig();
  const connectorChainId = config.state.connections.get(config.state.current ?? "")?.chainId;
  const { connectWallet } = usePrivy();

  const { sendTransaction: sendPrivySignerTransaction } = usePrivySignerTxs();

  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const isAdditionalSigner = connector?.id === SIGNER_CONNECTOR_ID;

  const addRecentTransaction = (tx: { description: string; hash: string }) => {
    console.log(tx);
    // TODO: Implement recent transaction tracking
  };

  return async function handleTx(params: HandleTransactionParams): Promise<void> {
    const { title, params: txParams, updateStep, beforeSigning, afterSigning, afterConfirming } = params;

    if (!isAdditionalSigner && (!walletClient || !publicClient)) return connectWallet();

    if (!txParams) return;

    const { chainId } = txParams;

    if (chainId == undefined) return;
    if ((connectorChainId && chainId != connectorChainId) || chainId != wagmiChainId) {
      try {
        await switchChainAsync({ chainId });
      } catch {
        return;
      }
    }

    let hash: WriteContractReturnType;
    try {
      updateStep({ status: "sending" });

      if (beforeSigning) await beforeSigning();

      if ("to" in txParams) hash = await sendTransactionWagmi(config, txParams);
      else {
        if (isAdditionalSigner) {
          hash = await sendPrivySignerTransaction(txParams);
        } else {
          hash = await writeContract(config, txParams);
        }
      }

      updateStep({ txHash: hash });

      if (afterSigning) await afterSigning(hash);

      addRecentTransaction({ description: title, hash });
    } catch (error) {
      if (afterSigning) await afterSigning(undefined);
      updateStep({ status: "idle", error });
      return;
    }

    try {
      updateStep({ status: "confirming", error: undefined });

      const receipt = await waitForTransactionReceipt(config, { hash, confirmations: params.confirmations });
      if (afterConfirming) await afterConfirming(receipt);

      updateStep({ status: "confirmed", error: undefined });
    } catch (error) {
      if (afterConfirming) await afterConfirming(undefined);

      updateStep({ status: "idle", error });
    }
  };
}
