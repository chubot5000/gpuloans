import { addressToBytes32 } from "@layerzerolabs/lz-v2-utilities";
import { useWeb3 } from "logic/components";
import { TxAction, TxStep, useContractStaticCall, useContractView, useHandleTx, useTxSteps } from "logic/hooks";
import { fundWallet } from "logic/hooks/privy/fundWallet";
import { OAdapterAbi } from "logic/pages/LoansPage/contracts/abis";
import { ERC20 } from "logic/pages/LoansPage/data";
import { applySlippage } from "logic/utils";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { erc20Abi, isAddress, maxUint256, toHex, zeroAddress } from "viem";
import { useBalance, useBlockNumber } from "wagmi";

import { CHAINS_PEER, NetworkEids, SendParam, TOKENS_ADAPTERS } from "./LzUtils";

interface useWithdrawTxParams {
  token: ERC20;
  chainId: number;
  amount: bigint;
  recipient: string;
  mainActionLabel?: string;
}

export function useWithdrawTx(params: useWithdrawTxParams) {
  const { token, chainId, amount, recipient: _recipient, mainActionLabel = "Withdraw" } = params;
  const { address: connectedAddress = zeroAddress } = useWeb3();
  const { steps, updateStepAtIndex, setSteps, currentStepIndex, isDone, currentStep, resetSteps } = useTxSteps(
    getInitialSteps(mainActionLabel),
  );
  const handleTx = useHandleTx();

  const recipient = isAddress(_recipient) ? _recipient : zeroAddress;
  const lzAdapter = TOKENS_ADAPTERS[token.address];

  const txsEnabled = Boolean(amount > 0 && connectedAddress !== zeroAddress && lzAdapter && recipient !== zeroAddress);

  const { data: allowance } = useContractView({
    address: token.address,
    abi: erc20Abi,
    functionName: "allowance",
    watch: true,
    args: [connectedAddress, lzAdapter],
    chainId,
    query: {
      enabled: Boolean(connectedAddress !== zeroAddress && lzAdapter),
    },
  });

  const isApproved = Boolean(allowance != undefined && amount && allowance >= amount);

  useEffect(() => {
    updateStepAtIndex(WithdrawTxSteps.APPROVE, { status: isApproved ? "confirmed" : "idle" });
  }, [isApproved, updateStepAtIndex]);

  const { data: approveData, error: approveError } = useContractStaticCall({
    address: token.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [lzAdapter, maxUint256],
    chainId,
    query: {
      enabled: txsEnabled && !isApproved,
    },
  });

  const lzSendParam: SendParam = useMemo(() => {
    const destChain = CHAINS_PEER[chainId];
    if (!destChain) {
      throw new Error(`No peer chain found for chainId: ${chainId}`);
    }

    return {
      dstEid: NetworkEids[destChain],
      to: toHex(addressToBytes32(recipient)),
      amountLD: amount,
      minAmountLD: applySlippage(amount, 0.1),
      extraOptions: "0x",
      composeMsg: "0x",
      oftCmd: "0x",
    };
  }, [chainId, amount, recipient]);

  const { data: sendQuote, error: sendQuoteError } = useContractView({
    address: lzAdapter,
    abi: OAdapterAbi,
    functionName: "quoteSend",
    args: [lzSendParam, false],
    chainId,
    query: {
      enabled: txsEnabled && isApproved,
    },
  });

  const txValue = sendQuote?.nativeFee;

  const [watchBlock, setWatchBlock] = useState(false);
  const { data: blockNumber } = useBlockNumber({ watch: { enabled: watchBlock, pollingInterval: 2_000 }, chainId });
  const { data: nativeBalance, error: nativeBalanceError } = useBalance({
    chainId,
    address: connectedAddress,
    blockNumber,
    query: {
      enabled: Boolean(connectedAddress !== zeroAddress),
    },
  });

  useEffect(() => {
    if (
      connectedAddress !== zeroAddress &&
      txValue !== undefined &&
      nativeBalance !== undefined &&
      nativeBalance.value < txValue
    ) {
      setWatchBlock(true);
      const promise = fundWallet({
        address: connectedAddress,
        amount: txValue * 3n,
        chainId,
      });
      toast.promise(promise, {
        loading: "Funding wallet...",
        success: "Wallet funded",
        error: "Failed to fund wallet",
      });
    }
  }, [connectedAddress, txValue, nativeBalance, chainId]);

  const { data: sendData, error: sendError } = useContractStaticCall(
    sendQuote
      ? {
          value: txValue,
          address: lzAdapter,
          abi: OAdapterAbi,
          functionName: "send",
          args: [lzSendParam, sendQuote, recipient],
          chainId,
          query: {
            enabled: Boolean(
              txsEnabled && isApproved && txValue && nativeBalance && nativeBalance.value >= txValue && !isDone,
            ),
          },
        }
      : undefined,
  );

  /**************************************************************************/
  /* Handlers */
  /**************************************************************************/
  async function approve() {
    return await handleTx({
      title: "Approve",
      params: approveData?.request,
      updateStep: (updates) => updateStepAtIndex(WithdrawTxSteps.APPROVE, updates),
    });
  }

  async function withdraw() {
    return await handleTx({
      title: "Withdraw",
      params: sendData?.request,
      updateStep: (updates) => updateStepAtIndex(WithdrawTxSteps.WITHDRAW, updates),
    });
  }

  /**************************************************************************/
  /* Actions */
  /**************************************************************************/
  const withdrawActions: TxAction[] = [
    {
      send: approveData?.request && approve,
      error: approveError,
    },
    {
      send: sendData?.request && withdraw,
      error: sendQuoteError || sendError || nativeBalanceError,
    },
  ];

  const action = withdrawActions[currentStepIndex];

  useEffect(() => {
    setSteps(steps.map((s, i) => ({ ...s, error: withdrawActions[i]?.error })));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approveError, sendQuoteError, sendError]);

  return {
    // Tx steps
    steps,
    updateStepAtIndex,
    currentStepIndex,
    currentStep,
    resetSteps,

    // Tx actions
    action,
    isDone,
  };
}

enum WithdrawTxSteps {
  APPROVE,
  WITHDRAW,
}

function getInitialSteps(mainActionLabel: string): TxStep[] {
  return [
    {
      title: "Approve",
      action: "Approve",
      status: "idle",
    },
    {
      title: mainActionLabel,
      action: mainActionLabel,
      status: "idle",
    },
  ];
}
