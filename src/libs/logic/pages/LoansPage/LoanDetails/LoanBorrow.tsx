import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { keepPreviousData } from "@tanstack/react-query";
import { NftMetadata } from "data/supabase";
import { getUnixTime } from "date-fns";
import { Step } from "logic/components";
import { useContractView } from "logic/hooks";
import {
  cn,
  denormalizeRate,
  formatDate,
  formatDuration,
  fromUnits,
  PolymorphProps,
  printFiat,
  printPercent2FD,
} from "logic/utils";
import { ElementType, ReactNode } from "react";
import { AmountTooltip, Button, Tooltip } from "ui/components";

import { INTEREST_RATE_MODEL_ABI, loanToAbiTerms } from "../contracts";
import { Loan } from "../data";
import { PaymentSchedule } from "../PaymentSchedule";
import { calcPaymentSchedule } from "../PaymentSchedule/calcPaymentSchedule";
import { useBorrowerLoans } from "../useBorrowerLoans";
import { useBorrowTx } from "../useBorrowTx";

import { Cell, Row } from "./components";

type Props = {
  loan: Loan;
};

export function LoanBorrow(props: Props) {
  const { loan } = props;

  const {
    duration,
    erc20: { decimals },
    nfts: { tokenIds, metadata },
  } = loan;

  const { data: totalRepaymentUnits } = useContractView({
    address: loan.interestRateModel,
    abi: INTEREST_RATE_MODEL_ABI,
    functionName: "repayment",
    args: [
      loanToAbiTerms({ ...loan, gracePeriodDuration: 0, gracePeriodRate: 0n }),
      loan.principal,
      BigInt(loan.repaymentInterval),
      BigInt(duration),
      BigInt(getUnixTime(new Date()) + duration),
    ],
    chainId: loan.chain,
    query: {
      placeholderData: keepPreviousData,
      select: (data) => data[0] + data[1],
    },
  });
  const totalRepayment = totalRepaymentUnits ? <AmountTooltip amount={totalRepaymentUnits} decimals={decimals} /> : "-";

  const nextPayment = calcPaymentSchedule(loan).repayments[0]?.total ?? 0n;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 w-full gap-px border border-outline-major bg-outline-major">
      <Cell className={cn("flex-col", tokenIds.length === 1 ? "lg:col-span-2" : "lg:col-span-3")}>
        {tokenIds.length === 1 ? (
          <SingleAssetView nft={metadata[tokenIds[0].toString()]} />
        ) : (
          <>
            <div className="flex items-center justify-between">
              <span className="text-base text-text-primary font-medium">Asset Details</span>

              <span>
                <span className="text-text-secondary text-sm">Total Owned:</span>{" "}
                <span className="text-text-primary">{tokenIds.length}</span>
              </span>
            </div>

            <AssetRowTemplate className="text-text-secondary uppercase text-sm font-normal border-t border-b py-1 mt-4">
              <span>Asset</span>
              <span className="text-end">Collateral Value</span>
            </AssetRowTemplate>

            <div className="flex flex-col divide-y divide-outline-minor overflow-y-auto max-h-56 md:max-h-none md:h-0 grow">
              {tokenIds.map((tokenId) => (
                <AssetRow key={tokenId.toString()} tokenId={tokenId} nft={metadata[tokenId.toString()]} />
              ))}
            </div>
          </>
        )}
      </Cell>

      <div className={cn("flex flex-col gap-px", tokenIds.length === 1 ? "lg:col-span-4" : "lg:col-span-3")}>
        <Cell className="flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-base">Borrow Terms</span>
            <span className="text-xs text-text-secondary">(all amounts are in {loan.erc20.symbol})</span>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1 pt-2">
              <Row
                label="Principal (Loan Amount)"
                labelClassName="font-medium"
                value={<AmountTooltip amount={loan.principal} decimals={decimals} />}
              />

              {loan.originationFee ? (
                <Row
                  label="Origination Fee"
                  valueClassName="font-normal"
                  value={
                    <>
                      (
                      {printFiat(
                        fromUnits(loan.originationFee, decimals).minus(loan.metadata.capitalizeInsurance ?? 0),
                      )}
                      )
                    </>
                  }
                  className="pl-6"
                />
              ) : null}

              {loan.metadata.capitalizeInsurance != null ? (
                <Row
                  label="Capitalized Insurance"
                  valueClassName="font-normal"
                  value={<>({printFiat(loan.metadata.capitalizeInsurance)})</>}
                  className="pl-6"
                />
              ) : null}
            </div>

            <Row
              label="Net Loan Proceeds"
              labelClassName="font-medium"
              value={<AmountTooltip amount={loan.principal - loan.originationFee} decimals={decimals} />}
              className="border-y border-outline-minor py-2"
            />

            {loan.metadata.debtReserveAccount != null ? (
              <div className="flex flex-col gap-1 border-b border-outline-minor pb-2">
                <Row
                  label={<span className="text-outline-major">Available for Withdrawal</span>}
                  valueClassName="font-normal text-text-secondary"
                  value={printFiat(
                    fromUnits(loan.principal - loan.originationFee, decimals).minus(loan.metadata.debtReserveAccount),
                  )}
                  className="pl-6"
                />
                <Row
                  label={
                    <Tooltip
                      className="cursor-help"
                      trigger={
                        <span className="text-outline-major inline-flex items-center gap-1">
                          Initial Reserve Deposit
                          <InformationCircleIcon className="size-4 stroke-2" />
                        </span>
                      }
                      tooltipText="Amount of Net Loan Proceeds to be deposited into the Reserve Account as stated in the Loan Agreement."
                    />
                  }
                  valueClassName="font-normal text-text-secondary"
                  value={printFiat(loan.metadata.debtReserveAccount)}
                  className="pl-6"
                />
              </div>
            ) : null}

            <Row
              label="Maturity Date"
              valueClassName="font-normal"
              value={
                <>
                  {formatDate(getUnixTime(new Date()) + duration)} ({formatDuration(duration)})
                </>
              }
              className="pt-2"
            />

            <Row
              label="APR"
              valueClassName="font-normal"
              value={printPercent2FD(denormalizeRate(loan.blendedRate), { minimumFractionDigits: 1 })}
            />

            <Row
              label="Default Grace Period APR"
              valueClassName="text-status-red-300"
              value={printPercent2FD(denormalizeRate(loan.blendedRate + loan.gracePeriodRate))}
              className="pb-2"
            />
          </div>
        </Cell>

        <Cell className="flex-col grow">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-base">Payment Terms</span>
              <PaymentSchedule loan={loan} />
            </div>

            <Row
              label="Payment Amount"
              valueClassName="font-normal"
              value={<AmountTooltip amount={nextPayment} decimals={decimals} />}
              className="border-b border-outline-minor py-2"
            />

            <Row
              label="Payment Frequency"
              valueClassName="font-normal"
              value={formatDuration(loan.repaymentInterval)}
              className="border-b border-outline-minor py-2"
            />

            <Row
              label="Default Grace Period"
              valueClassName="font-normal"
              value={formatDuration(loan.gracePeriodDuration)}
              className="border-b border-outline-minor py-2"
            />

            <Row
              label="Total Loan Repayment"
              valueClassName="font-normal"
              value={totalRepayment}
              className="border-b border-outline-minor py-2"
            />

            {loan.exitFee ? (
              <Row
                label="Exit Fee"
                valueClassName="text-status-red-300"
                value={<AmountTooltip amount={loan.exitFee} decimals={decimals} />}
                className="py-2"
              />
            ) : null}
          </div>
        </Cell>
      </div>

      <TxSteps loan={loan} />
    </div>
  );
}

type SingleAssetViewProps = {
  nft: NftMetadata | undefined;
};

function SingleAssetView(props: SingleAssetViewProps) {
  const { nft } = props;

  return (
    <div className="flex flex-col gap-5">
      <span className="text-base text-text-primary">Collateral Details</span>

      <img
        src={nft?.metadata.image}
        alt={nft?.metadata.name}
        className="w-full aspect-square rounded bg-outline-minor object-cover"
      />

      <div className="flex flex-col text-sm">
        <span className="text-text-secondary font-medium">Description</span>
        <span className="text-text-primary">{nft?.metadata.description ?? "-"}</span>

        <span className="text-text-secondary font-medium mt-3">Collateral Value</span>
        <span className="text-text-primary">{printFiat(nft?.metadata.collateralValueUSD ?? 0)}</span>
      </div>
    </div>
  );
}

type AssetRowProps = {
  tokenId: bigint;
  nft: NftMetadata | undefined;
};

function AssetRow(props: AssetRowProps) {
  const { tokenId, nft } = props;

  return (
    <AssetRowTemplate className="py-2">
      <>
        <img src={nft?.metadata.image} alt={nft?.metadata.name} className="size-11 rounded bg-outline-minor mr-4" />
        <div className="flex flex-col grow justify-between self-stretch">
          <div className="flex">
            <span className="grow w-0 truncate text-text-primary text-sm">{nft?.metadata.name ?? "-"}</span>
          </div>
          <span className="text-text-secondary text-xs">Token ID #{tokenId}</span>
        </div>
      </>

      <span>{printFiat(nft?.metadata.collateralValueUSD ?? 0)}</span>
    </AssetRowTemplate>
  );
}

type AssetRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode];
    className?: string;
  }
>;

function AssetRowTemplate<T extends ElementType>(props: AssetRowTemplateProps<T>) {
  const { as: Component = "div", className, children, ...rest } = props;

  return (
    <Component
      className={cn("flex items-center justify-between text-sm px-4 [&>div]:flex [&>div]:items-center", className)}
      {...rest}
    >
      <div className="w-[70%]">{children[0]}</div>
      <div className="w-[30%] justify-end">{children[1]}</div>
    </Component>
  );
}

function TxSteps(props: { loan: Loan }) {
  const { loan } = props;

  const { refetch: refetchBorrowerLoans, isRefetching: isRefetchingBorrowerLoans } = useBorrowerLoans();

  const { steps, action, currentStepIndex } = useBorrowTx(loan);
  const currentStep = steps[currentStepIndex];

  const isDone = steps.at(-1)?.status == "confirmed";
  async function afterDone() {
    await refetchBorrowerLoans();
  }

  const isLoading = isDone
    ? isRefetchingBorrowerLoans
    : currentStep.status == "sending" || currentStep.status == "confirming";

  return (
    <div className="flex flex-col gap-px col-span-full lg:col-span-2">
      <Cell className="h-[3.75rem] items-center">
        <span className="text-text-primary font-medium text-base">Transaction Details</span>
      </Cell>
      <Cell className="flex-col grow">
        {steps.map((step, index) => (
          <Step key={index} step={step} index={index} currentStepIndex={currentStepIndex} />
        ))}
      </Cell>

      <Button
        className="btn-large btn-primary"
        isLoading={isLoading}
        onClick={isDone ? afterDone : action.send}
        disabled={!action.send}
      >
        {isDone ? "Done" : currentStep.action}
      </Button>
    </div>
  );
}
