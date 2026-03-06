import { chainsMetadata } from "data/rpc";
import { TxStep } from "logic/hooks";
import { cn } from "logic/utils";
import { SquareArrowOutUpRightIcon } from "lucide-react";
import { ExternalLink } from "ui/components";

type BaseTxLinkProps = {
  chainId: number;
  className?: string;
  isBridge?: boolean;
};

function getLzScanUrl(chainId: number) {
  const chainMetadata = chainsMetadata[chainId];
  const isTestnet = chainMetadata.viemChain.testnet;
  return isTestnet ? "https://testnet.layerzeroscan.com" : "https://layerzeroscan.com";
}

export function TxLink({
  txHash,
  isBridge,
  chainId,
  className,
}: {
  txHash: string | undefined;
  chainId: number;
} & BaseTxLinkProps) {
  if (!txHash) return null;

  const url = isBridge
    ? `${getLzScanUrl(chainId)}/tx/${txHash}`
    : `${chainsMetadata[chainId].explorerUrl}/tx/${txHash}`;

  return (
    <ExternalLink className={cn(`flex items-center gap-1 text-sm text-text-secondary`, className)} href={url}>
      {isBridge ? "View bridge details" : "View transaction"} <SquareArrowOutUpRightIcon className="size-3.5" />
    </ExternalLink>
  );
}

export function StepTxLink(
  props: {
    step: TxStep | undefined;
  } & BaseTxLinkProps,
) {
  const { step } = props;

  if (!step || step.status !== "confirmed" || !step.txHash) return null;

  return <TxLink txHash={step.txHash} {...props} />;
}
