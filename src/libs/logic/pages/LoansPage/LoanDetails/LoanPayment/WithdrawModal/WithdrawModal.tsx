import { BaseTxButton, Step, StepTxLink, useWeb3 } from "logic/components";
import { useContractView, useDebounceCallback } from "logic/hooks";
import { usePrivyUserMetadata } from "logic/hooks/privy/usePrivyUserMetadata";
import { ERC20 } from "logic/pages/LoansPage/data";
import { fromUnits, printNumber, toUnits } from "logic/utils";
import { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button, Input, Modal, Select, Skeleton, type ModalBaseProps, type SelectOption } from "ui/components";
import { Address, erc20Abi, isAddress, zeroAddress } from "viem";

import { useWithdrawTx } from "./useWithdrawTx";

type Props = ModalBaseProps & {
  token: ERC20;
  chainId: number;
};

export function WithdrawModal(props: Props) {
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <Modal.Title>Withdraw Funds</Modal.Title>
      <ErrorBoundary
        FallbackComponent={({ error }) => (
          <div className="h-96 flex items-center flex-col gap-1 justify-center">
            <span className="text-sm text-secondary">Something went wrong</span>
            {error instanceof Error && <span className="text-sm text-secondary">({error.message})</span>}
          </div>
        )}
      >
        <WithdrawModal_ {...props} />
      </ErrorBoundary>
    </Modal>
  );
}
function WithdrawModal_(props: Props) {
  const { token, chainId, onClose } = props;

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const amountUnits = toUnits(amount || "0", token.decimals);

  const { action, isDone, steps, currentStep, currentStepIndex } = useWithdrawTx({
    amount: amountUnits,
    recipient,
    token,
    chainId,
  });
  const isPending = currentStep.status == "sending" || currentStep.status == "confirming";

  const [{ addressError, amountError }, setErrors] = useState<{
    addressError: string | undefined;
    amountError: string | undefined;
  }>({ addressError: undefined, amountError: undefined });

  const debouncedSetErrors = useDebounceCallback(setErrors, 500);

  useEffect(() => {
    debouncedSetErrors({
      addressError: recipient && !isAddress(recipient) ? "Invalid address" : undefined,
      amountError: amount && (isNaN(Number(amount)) || Number(amount) <= 0) ? "Invalid amount" : undefined,
    });
  }, [recipient, amount, debouncedSetErrors]);

  const canSubmit = Boolean(action.send && amountUnits && recipient && !addressError && !amountError);

  const onSubmit = () => {
    if (!canSubmit) return;
    console.log(action);

    if (action.send) {
      action.send();
    }
  };

  return (
    <Modal.Children className="gap-1">
      <div className="flex flex-col gap-8">
        <WithdrawForm
          token={token}
          chainId={chainId}
          recipient={recipient}
          amount={amount}
          addressError={addressError}
          amountError={amountError}
          setRecipient={setRecipient}
          setAmount={setAmount}
        />
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

interface WithdrawFormProps {
  recipient: string;
  amount: string;
  addressError: string | undefined;
  amountError: string | undefined;
  setRecipient: (recipient: string) => void;
  setAmount: (amount: string) => void;
  token: ERC20;
  chainId: number;
}

function WithdrawForm(props: WithdrawFormProps) {
  const { recipient, amount, setRecipient, setAmount, token, chainId } = props;

  const { address: connectedAddress = zeroAddress } = useWeb3();
  const { linkedWallets } = usePrivyUserMetadata();

  const recipients = linkedWallets.find((w) => w.address === connectedAddress.toLowerCase())?.recipients ?? [];

  const { data: balance } = useContractView({
    address: token.address,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [connectedAddress as Address],
    chainId,
    query: {
      enabled: Boolean(connectedAddress !== zeroAddress),
    },
  });

  return (
    <div className="flex flex-col gap-4 w-full">
      <RecipientSelect recipients={recipients} value={recipient} onChange={setRecipient} />
      <div className="flex flex-col gap-2">
        <label className="text-sm text-secondary">Amount</label>
        <Input type="number" value={amount} onChange={setAmount} placeholder="0.0" />
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm text-secondary">
            Balance:{" "}
            {balance !== undefined ? (
              `$${printNumber(fromUnits(balance, token.decimals))}`
            ) : (
              <Skeleton className="w-10 h-4" />
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

interface RecipientSelectProps {
  recipients: Address[];
  value: string;
  onChange: (value: string) => void;
}

function RecipientSelect({ recipients, value, onChange }: RecipientSelectProps) {
  const isEmpty = recipients.length === 0;
  const isSingle = recipients.length === 1;

  useEffect(() => {
    if (isSingle && value !== recipients[0]) {
      onChange(recipients[0]);
    }
  }, [isSingle, recipients, value, onChange]);

  const options: SelectOption[] = recipients.map((address) => ({
    value: address,
    label: `${address.slice(0, 6)}...${address.slice(-4)}`,
  }));

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm text-secondary">Whitelisted Recipient {`Address${isSingle ? "" : "es"}`}:</label>
      <Select
        triggerClassName="border border-outline-major bg-white"
        value={value}
        onChange={onChange}
        options={options}
        placeholder={isEmpty ? "No whitelisted recipients" : "Select recipient"}
        disabled={isEmpty || isSingle}
      />
    </div>
  );
}
