import { chainsMetadata } from "data/rpc";
import { useContractView } from "logic/hooks";
import { cn, fromUnits, printNumber } from "logic/utils";
import { Skeleton } from "ui/components";
import { Address, erc20Abi } from "viem";

interface TokenMetadata {
  symbol: string;
  logoUrl: string;
}

interface ChainBalanceProps {
  chainId: number;
  tokenAddress: Address;
  borrower: Address;
  decimals: number;
  className?: string;
  tokenMetadata?: TokenMetadata;
}

export function ChainBalance(props: ChainBalanceProps) {
  const { chainId, tokenAddress, borrower, decimals, tokenMetadata, className } = props;

  const { data: balance } = useContractView({
    address: tokenAddress,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [borrower],
    watch: true,
    chainId,
  });

  const chainMeta = chainsMetadata[chainId];
  if (!chainMeta) return null;
  const logoUrl = tokenMetadata?.logoUrl ?? chainMeta.logoUrl;
  const name = tokenMetadata?.symbol ?? chainMeta.name;

  return (
    <div className={cn("flex items-center gap-1 text-text-dark-secondary", className)}>
      <img src={logoUrl} alt={name} title={name} className="shrink-0 size-4" />
      <span className="text-xs">
        {balance !== undefined ? `$${printNumber(fromUnits(balance, decimals))}` : <Skeleton className="w-16 h-3" />}
      </span>
    </div>
  );
}
