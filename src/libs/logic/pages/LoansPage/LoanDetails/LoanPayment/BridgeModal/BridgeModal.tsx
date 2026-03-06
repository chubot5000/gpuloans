import { chainsMetadata } from "data/rpc";
import { BaseTxButton, Step, StepTxLink, useWeb3 } from "logic/components";
import { useContractView } from "logic/hooks";
import { ERC20 } from "logic/pages/LoansPage/data";
import { fromUnits, printNumber, toUnits } from "logic/utils";
import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button, Input, Modal, Skeleton, type ModalBaseProps } from "ui/components";
import { Address, erc20Abi, zeroAddress } from "viem";

import { CHAINS_PEER, TOKENS_PEER } from "../WithdrawModal/LzUtils";

import { useBridgeTx } from "./useBridgeTx";

type Props = ModalBaseProps & {
  token: ERC20;
  chainId: number;
};

export function BridgeModal(props: Props) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <Modal.Title>Bridge Funds</Modal.Title>
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <div className="flex h-96 flex-col items-center justify-center gap-1">
            <span className="text-sm text-secondary">Something went wrong</span>
            {error instanceof Error && <span className="text-sm text-secondary">({error.message})</span>}
          </div>
        )}
      >
        <BridgeModal_ {...props} />
      </ErrorBoundary>
    </Modal>
  );
}

function BridgeModal_(props: Props) {
  const { token, chainId, onClose } = props;

  const srcChain = CHAINS_PEER[chainId];
  const destToken = token;
  const srcToken: ERC20 = {
    address: TOKENS_PEER[destToken.address.toLowerCase() as Address],
    decimals: destToken.decimals,
    symbol: destToken.symbol,
  };
  const [amount, setAmount] = useState("");
  const amountUnits = toUnits(amount || "0", srcToken.decimals);

  const { action, isDone, steps, currentStep, currentStepIndex } = useBridgeTx({
    amount: amountUnits,
    token: srcToken,
    chainId: srcChain,
  });
  const isPending = currentStep.status == "sending" || currentStep.status == "confirming";

  const canSubmit = Boolean(action.send && amountUnits);

  const onSubmit = () => {
    if (!canSubmit) return;
    if (action.send) {
      action.send();
    }
  };

  return (
    <Modal.Children className="gap-1">
      <div className="flex flex-col gap-8">
        <BridgeForm token={srcToken} chainId={srcChain} amount={amount} setAmount={setAmount} />
        <div className="w-full">
          {steps.map((step, index) => (
            <Step
              stepContent={<StepTxLink chainId={chainId} step={step} />}
              key={index}
              step={step}
              index={index}
              currentStepIndex={currentStepIndex}
            />
          ))}
        </div>
      </div>
      <BaseTxButton
        disabled={!canSubmit}
        isLoading={isPending}
        isDone={isDone}
        onDone={() => onClose?.(false)}
        onClick={onSubmit}
      >
        {currentStep.action}
      </BaseTxButton>
    </Modal.Children>
  );
}

interface BridgeFormProps {
  amount: string;
  setAmount: (amount: string) => void;
  token: ERC20;
  chainId: number;
}

function BridgeForm(props: BridgeFormProps) {
  const { amount, setAmount, token, chainId } = props;

  const { address: connectedAddress = zeroAddress } = useWeb3();

  const { data: balance, ...rest } = useContractView({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [connectedAddress as Address],
    chainId,
    query: {
      enabled: Boolean(connectedAddress !== zeroAddress),
    },
  });

  useEffect(() => {
    console.log(rest);
  }, [rest]);

  const sourceChain = chainsMetadata[chainId];
  const destChainId = CHAINS_PEER[chainId];
  const destChain = destChainId ? chainsMetadata[destChainId] : undefined;

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-center gap-3 text-sm text-secondary">
        <span>{sourceChain?.name ?? "Unknown"}</span>
        <ArrowRightIcon className="size-4 text-text-secondary" />
        <span>{destChain?.name ?? "Unknown"}</span>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm text-secondary">Amount</label>
        <Input type="number" value={amount} onChange={setAmount} placeholder="0.0" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-secondary">
            Balance:{" "}
            {balance !== undefined ? (
              `$${printNumber(fromUnits(balance, token.decimals))}`
            ) : (
              <Skeleton className="h-4 w-10" />
            )}
          </span>
          <Button
            disabled={balance === undefined}
            onClick={() => setAmount(fromUnits(balance ?? 0n, token.decimals).toString())}
            className="btn-xs btn-tertiary"
          >
            Max
          </Button>
        </div>
      </div>
    </div>
  );
}
