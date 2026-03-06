import { keepPreviousData } from "@tanstack/react-query";
import {
  TxAction,
  TxStep,
  useContractStaticCall,
  useContractView,
  useHandleTx,
  useTxSteps,
  useRefetchOnBlockNumber,
} from "logic/hooks";
import { scaleDown } from "logic/utils";
import { useEffect, useRef } from "react";
import { erc20Abi, maxUint256 } from "viem";
import { useBlock } from "wagmi";

import { LOAN_ADDRESSES, LOAN_ROUTER_ABI, loanToAbiTerms } from "./contracts";
import { Loan } from "./data";

export function useRepayTx(loan: Loan, customPaymentAmount?: bigint) {
  const { borrower, chain: chainId } = loan;

  const isPrepayment = Boolean(customPaymentAmount);
  const actionTitle = isPrepayment ? "Prepay" : "Pay";

  const { data: block, queryKey: blockQueryKey } = useBlock({ chainId });
  useRefetchOnBlockNumber({
    chainId,
    enabled: true,
    queryKeyToInvalidate: blockQueryKey,
  });

  const { loanRouter } = LOAN_ADDRESSES[chainId];

  /* quote 3 minutes into the future, and refetch every 30 seconds */
  const { data: quote } = useContractView(
    block
      ? {
          address: loanRouter,
          abi: LOAN_ROUTER_ABI,
          functionName: "quote",
          args: [loanToAbiTerms(loan), block.timestamp + 180n],
          chainId,
          query: {
            placeholderData: keepPreviousData,
            select: (data) => BigInt(data[0] + data[1] + data[2]),
            refetchInterval: 30_000,
          },
        }
      : undefined,
  );

  let paymentAmount = quote;
  if (customPaymentAmount) {
    paymentAmount = customPaymentAmount;
    if (paymentAmount >= scaleDown(loan.loanState.scaledBalance, loan.erc20.decimals)) {
      paymentAmount += loan.exitFee;
    }
  }

  const { data: balance } = useContractView({
    address: loan.erc20.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [borrower],
    chainId,
  });
  const isBalanceInsufficient = balance != undefined && paymentAmount != undefined && balance < paymentAmount;

  const { data: allowance, refetch: refetchAllowance } = useContractView({
    address: loan.erc20.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [borrower, loanRouter],
    chainId,
  });
  const isApproved = paymentAmount != undefined && allowance != undefined && allowance >= paymentAmount;

  const { data: approveData, error: approveError } = useContractStaticCall({
    address: loan.erc20.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [loanRouter, maxUint256],
    chainId,
    query: {
      enabled: !isApproved,
    },
  });

  const { data: repayData, error: repayError } = useContractStaticCall(
    paymentAmount
      ? {
          address: loanRouter,
          abi: LOAN_ROUTER_ABI,
          functionName: "repay",
          args: [loanToAbiTerms(loan), paymentAmount],
          chainId,
          query: {
            enabled: isApproved && !isBalanceInsufficient,
          },
        }
      : undefined,
  );

  const { steps, updateStepAtIndex, currentStepIndex } = useTxSteps(getInitialSteps());
  const handleTx = useHandleTx();

  const canUpdateApproval = useRef(true);
  useEffect(() => {
    if (!canUpdateApproval.current) return;
    updateStepAtIndex(0, { status: isApproved ? "confirmed" : "idle" });
  }, [isApproved]);

  useEffect(() => {
    updateStepAtIndex(1, { action: actionTitle, title: actionTitle });
  }, [actionTitle]);

  async function approve() {
    return await handleTx({
      title: "Approve",
      params: approveData?.request,
      updateStep: (updates) => updateStepAtIndex(0, updates),
      afterSigning: () => {
        canUpdateApproval.current = false;
      },
      afterConfirming: async (receipt) => {
        if (!receipt) canUpdateApproval.current = true;
        else await refetchAllowance();
      },
    });
  }

  async function repay() {
    return await handleTx({
      title: actionTitle,
      params: repayData?.request,
      updateStep: (updates) => updateStepAtIndex(1, updates),
    });
  }

  let action: TxAction;
  if (steps[0].status != "confirmed") {
    action = { send: approveData?.request && approve, error: approveError };
  } else {
    action = { send: repayData?.request && repay, error: repayError };
  }

  return { action, steps, currentStepIndex, isBalanceInsufficient };
}

function getInitialSteps(): TxStep[] {
  return [
    {
      title: "Approve",
      action: "Approve",
      status: "idle",
    },
    {
      title: "Repay",
      action: "Repay",
      status: "idle",
    },
  ];
}
