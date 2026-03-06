import { noop } from "lodash";
import { useWeb3 } from "logic/components";
import {
  TxAction,
  TxStep,
  useContractStaticCall,
  useContractView,
  useHandleTx,
  usePrivySignerTxs,
  useTxSteps,
} from "logic/hooks";
import { toUnits } from "logic/utils";
import { useEffect, useState } from "react";
import { erc20Abi, erc721Abi, maxUint256, zeroAddress } from "viem";

import {
  BUNDLE_CW_ABI,
  DEPOSIT_TIMELOCK_ABI,
  LOAN_ADDRESSES,
  LOAN_ROUTER_ABI,
  loanToAbiTerms,
  UsdaiAbi,
} from "../contracts";
import { Loan } from "../data";
import { useLoansPage } from "../LoansPageProvider";

export function useBorrowTx(terms: Loan) {
  const { address = zeroAddress } = useWeb3();
  const { sendTransaction } = usePrivySignerTxs();
  const { isWithdrawModalOpen, setIsWithdrawModalOpen } = useLoansPage();

  const {
    chain: chainId,
    nfts: { collection, tokenIds, bundle, isBundled: _isBundled },
    erc20,
  } = terms;
  const { loanRouter, usdai } = LOAN_ADDRESSES[chainId];

  const isSingleToken = tokenIds.length === 1 && !terms.metadata.forceBundle;
  const [isBundled, setIsBundled] = useState(_isBundled);

  // For single token: approve collection to loanRouter directly
  // For multi token: approve collection to bundle contract
  const approvalOperator = isSingleToken ? loanRouter : bundle.collection;

  const { data: isCollectionApproved, refetch: refetchIsCollectionApproved } = useContractView({
    address: collection,
    abi: erc721Abi,
    functionName: "isApprovedForAll",
    args: [address, approvalOperator],
    chainId,
    query: {
      enabled: Boolean(address !== zeroAddress),
    },
  });

  const { data: isBundleApproved, refetch: refetchIsBundleApproved } = useContractView({
    address: bundle.collection,
    abi: erc721Abi,
    functionName: "isApprovedForAll",
    args: [address, loanRouter],
    chainId,
    query: {
      enabled: Boolean(!isSingleToken && address !== zeroAddress),
    },
  });

  const { data: collectionApprovalData, error: collectionApprovalError } = useContractStaticCall({
    address: collection,
    abi: erc721Abi,
    functionName: "setApprovalForAll",
    args: [approvalOperator, true],
    chainId,
    query: {
      enabled: isSingleToken ? Boolean(!isCollectionApproved) : Boolean(!isBundled && !isCollectionApproved),
    },
  });

  const { data: bundleData, error: bundleError } = useContractStaticCall({
    address: bundle.collection,
    abi: BUNDLE_CW_ABI,
    functionName: "mint",
    args: [collection, tokenIds],
    chainId,
    query: {
      enabled: Boolean(!isSingleToken && !isBundled && isCollectionApproved),
    },
  });

  const { data: bundleApprovalData, error: bundleApprovalError } = useContractStaticCall({
    address: bundle.collection,
    abi: erc721Abi,
    functionName: "setApprovalForAll",
    args: [loanRouter, true],
    chainId,
    query: {
      enabled: Boolean(!isSingleToken && isBundled && !isBundleApproved),
    },
  });

  /**************************************************************************/
  /* USDai deposit */
  /**************************************************************************/
  const { data: erc20Allowance, refetch: refetchErc20Allowance } = useContractView({
    address: erc20.address,
    abi: erc20Abi,
    functionName: "allowance",
    args: [address, usdai],
    chainId,
    query: {
      enabled: Boolean(address !== zeroAddress),
    },
  });
  const isErc20Approved = erc20Allowance !== undefined && erc20Allowance >= maxUint256 / 2n;

  const { data: approveErc20Data } = useContractStaticCall({
    address: erc20.address,
    abi: erc20Abi,
    functionName: "approve",
    args: [usdai, maxUint256],
    chainId,
    query: {
      enabled: Boolean(address !== zeroAddress && !isErc20Approved),
    },
  });

  const { data: borrowData, error: borrowError } = useContractStaticCall({
    address: loanRouter,
    abi: [...LOAN_ROUTER_ABI, ...DEPOSIT_TIMELOCK_ABI],
    functionName: "borrow",
    args: [loanToAbiTerms(terms), terms.trancheSpecs.map((_) => ({ depositType: 0, data: "0x" }) as const)],
    chainId,
    query: {
      enabled: isSingleToken ? Boolean(isCollectionApproved) : Boolean(isBundled && isBundleApproved),
    },
  });

  const bundleStepIndex = isSingleToken ? -1 : 1;
  const approveBundleStepIndex = isSingleToken ? -1 : 2;
  const borrowStepIndex = isSingleToken ? 1 : 3;
  const withdrawStepIndex = isSingleToken ? 2 : 4;

  const { steps, updateStepAtIndex, currentStepIndex } = useTxSteps(getInitialSteps(isSingleToken));
  const handleTx = useHandleTx();

  // Token balance to set withdraw to Done
  const { data: erc20Balance } = useContractView({
    address: erc20.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
    chainId,
    watch: true,
    query: {
      enabled: Boolean(address !== zeroAddress),
    },
  });

  // Update the WITHDRAW step when balance change
  const [canSkipWithdraw, setCanSkipWithdraw] = useState(false);
  const borrowStatus = steps[borrowStepIndex]?.status;
  const debtReserveAccount = toUnits(terms.metadata.debtReserveAccount ?? 0, terms.erc20.decimals);
  useEffect(() => {
    const thirdOfDebtReserveAccount = debtReserveAccount / 3n;

    if (
      erc20Balance !== undefined &&
      borrowStatus === "confirmed" &&
      thirdOfDebtReserveAccount >= erc20Balance &&
      canSkipWithdraw
    ) {
      updateStepAtIndex(withdrawStepIndex, { status: "confirmed" });
    } else updateStepAtIndex(withdrawStepIndex, { status: isWithdrawModalOpen ? "sending" : "idle" });
  }, [
    isWithdrawModalOpen,
    erc20Balance,
    debtReserveAccount,
    updateStepAtIndex,
    borrowStepIndex,
    withdrawStepIndex,
    canSkipWithdraw,
    borrowStatus,
  ]);

  /**************************************************************************/
  /* Update steps */
  /**************************************************************************/
  useEffect(() => {
    updateStepAtIndex(0, { status: isCollectionApproved ? "confirmed" : "idle" });
    if (!isSingleToken) {
      updateStepAtIndex(bundleStepIndex, { status: isBundled ? "confirmed" : "idle" });
      updateStepAtIndex(approveBundleStepIndex, { status: isBundleApproved && isErc20Approved ? "confirmed" : "idle" });
    }
  }, [
    updateStepAtIndex,
    isCollectionApproved,
    isBundleApproved,
    isBundled,
    isErc20Approved,
    isSingleToken,
    approveBundleStepIndex,
    bundleStepIndex,
  ]);

  /**************************************************************************/
  /* Txs Handlers */
  /**************************************************************************/
  async function approveCollection() {
    return await handleTx({
      title: "Approve Collateral",
      params: collectionApprovalData?.request,
      updateStep: (updates) => updateStepAtIndex(0, updates),
      afterConfirming: async (receipt) => {
        if (receipt) await refetchIsCollectionApproved();
      },
    });
  }

  async function bundleNFTs() {
    return await handleTx({
      title: "Bundle Collateral",
      params: bundleData?.request,
      updateStep: (updates) => updateStepAtIndex(bundleStepIndex, updates),
      afterConfirming: (receipt) => {
        if (receipt) setIsBundled(true);
      },
    });
  }

  async function approveBundle() {
    return await handleTx({
      title: "Approve Bundle",
      params: bundleApprovalData?.request,
      updateStep: (updates) => updateStepAtIndex(approveBundleStepIndex, updates),
      afterConfirming: async (receipt) => {
        if (receipt) await refetchIsBundleApproved();
      },
    });
  }

  async function approveErc20() {
    return await handleTx({
      title: `Approve ${erc20.symbol}`,
      params: approveErc20Data?.request,
      updateStep: noop,
      afterConfirming: async (receipt) => {
        if (receipt) await refetchErc20Allowance();
      },
    });
  }

  const [hasBorrowed, setHasBorrowed] = useState(false);
  async function borrowAndMint() {
    updateStepAtIndex(borrowStepIndex, { status: "sending" });
    if (!hasBorrowed)
      await handleTx({
        title: "Borrow",
        params: borrowData?.request,
        updateStep: noop,
        confirmations: 2,
      }).then(() => setHasBorrowed(true));

    try {
      await sendTransaction({
        address: usdai,
        abi: UsdaiAbi,
        functionName: "deposit",
        args: [erc20.address, debtReserveAccount, debtReserveAccount, address],
        account: address,
        chainId,
      });
      updateStepAtIndex(borrowStepIndex, { status: "confirmed" });
    } catch {
      updateStepAtIndex(borrowStepIndex, { status: "idle" });
    }
  }

  function withdraw() {
    setIsWithdrawModalOpen(true);
    setCanSkipWithdraw(true);
  }

  /**************************************************************************/
  /* Actions */
  /**************************************************************************/
  useEffect(() => {
    if (erc20Allowance !== undefined && !isErc20Approved && approveErc20Data?.request) {
      approveErc20();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isErc20Approved, approveErc20Data?.request, erc20Allowance]);

  const borrowActions: TxAction[] = isSingleToken
    ? [
        { send: collectionApprovalData?.request && approveCollection, error: collectionApprovalError },
        { send: borrowData?.request && isErc20Approved ? borrowAndMint : undefined, error: borrowError },
        { send: withdraw, error: null },
      ]
    : [
        { send: collectionApprovalData?.request && approveCollection, error: collectionApprovalError },
        { send: bundleData?.request && bundleNFTs, error: bundleError },
        { send: bundleApprovalData?.request && approveBundle, error: bundleApprovalError },
        {
          send: (hasBorrowed || borrowData?.request) && isErc20Approved ? borrowAndMint : undefined,
          error: borrowError,
        },
        { send: withdraw, error: null },
      ];

  const action = borrowActions[currentStepIndex];

  return { action, steps, currentStepIndex };
}

function getInitialSteps(isSingleToken: boolean): TxStep[] {
  if (isSingleToken) {
    return [
      {
        title: "Approve Collateral",
        action: "Approve",
        status: "idle",
      },
      {
        title: "Borrow",
        action: "Borrow",
        status: "idle",
      },
      {
        title: "Withdraw",
        action: "Withdraw",
        status: "idle",
      },
    ];
  }
  return [
    {
      title: "Approve Collateral",
      action: "Approve",
      status: "idle",
    },
    {
      title: "Bundle Collateral",
      action: "Bundle",
      status: "idle",
    },
    {
      title: "Approve Bundle",
      action: "Approve",
      status: "idle",
    },
    {
      title: "Borrow",
      action: "Borrow",
      status: "idle",
    },
    {
      title: "Withdraw",
      action: "Withdraw",
      status: "idle",
    },
  ];
}
