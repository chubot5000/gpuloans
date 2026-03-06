import { usePrivy, useWallets } from "@privy-io/react-auth";
import { useSetActiveWallet } from "@privy-io/wagmi";
import { compact, noop } from "lodash";
import { createCustomConnector, usePrivyAccount, useWeb3 } from "logic/components";
import { useContractStaticCall, useCopyToClipboard, useHandleTx, usePrivyUserMetadata } from "logic/hooks";
import { cn, truncateAddress } from "logic/utils";
import { CopyCheckIcon, CopyIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Spinner, Tooltip } from "ui/components";
import { erc20Abi, isAddressEqual, maxUint256, zeroAddress, type Address } from "viem";
import { arbitrum, sepolia } from "viem/chains";
import { useChainId, useConnect } from "wagmi";

export function WalletRows({ className = "" }) {
  const { user, linkWallet, createWallet } = usePrivyAccount();
  const userMetadata = usePrivyUserMetadata();

  const { address: activeWalletAddress } = useWeb3();

  const wallets = compact([...user.linkedAccounts.filter((a) => a.type == "wallet"), ...userMetadata.linkedWallets]);

  const isActiveWalletNotLinked =
    activeWalletAddress &&
    wallets.every((w) => w.address != activeWalletAddress) &&
    userMetadata?.linkedWallets.every((w) => w.address.toLowerCase() != activeWalletAddress.toLowerCase());

  const hasNoWallets = !wallets.length && !activeWalletAddress && !userMetadata?.linkedWallets.length;

  return (
    <div className={cn("flex flex-col", className)}>
      <span className="border-b border-outline-major pb-3.5">Wallets</span>

      <TempTxButton />

      {hasNoWallets ? (
        <div className="flex items-center justify-center p-4 gap-2">
          <Button className="btn-small btn-primary" onClick={() => linkWallet()}>
            Link Wallet
          </Button>
          <Button className="btn-small btn-primary" onClick={() => createWallet()}>
            Create Wallet
          </Button>
        </div>
      ) : (
        <div className="flex flex-col divide-outline-major">
          {wallets.map((w) => (
            <WalletRow key={w.address} address={w.address as Address} />
          ))}
          {isActiveWalletNotLinked ? <WalletRow address={activeWalletAddress} isUnlinked /> : null}
        </div>
      )}
    </div>
  );
}

interface WalletRowProps {
  address: Address;
  isUnlinked?: boolean;
}

function WalletRow(props: WalletRowProps) {
  const { address, isUnlinked } = props;
  const { copy, isCopied } = useCopyToClipboard();

  const { address: activeWalletAddress } = useWeb3();

  const isActive = activeWalletAddress == address;

  return (
    <div className="flex h-12 items-center gap-1 border-b border-outline-major px-4">
      <div className="grow flex items-center gap-1">
        <button onClick={() => copy(address)} type="button">
          {isCopied ? <CopyCheckIcon className="size-4 shrink-0" /> : <CopyIcon className="size-4 shrink-0" />}
        </button>
        <span className={cn("grow font-medium", { "animate-pulse text-orange-400": isUnlinked })}>
          {truncateAddress(address)}
        </span>
      </div>

      {isActive ? (
        <>
          <span className="bg-bg-secondary px-2.5 text-primary">Active</span>
          <div className="mx-1 h-4 w-px bg-outline-major" />
        </>
      ) : (
        <ActivateWalletButton address={address} />
      )}

      {isUnlinked ? <LinkWallet address={address} /> : <UnlinkWallet address={address} />}
    </div>
  );
}

interface ActivateWalletButtonProps {
  address: Address;
}
function ActivateWalletButton(props: ActivateWalletButtonProps) {
  const { address } = props;
  const { wallets } = useWallets();
  const {
    account: { address: activeAddress = zeroAddress, addresses },
  } = useWeb3();
  const { mutate: connect } = useConnect();
  const { setActiveWallet } = useSetActiveWallet();
  const userMetadata = usePrivyUserMetadata();
  const { connectWallet } = usePrivy();

  const isConnected = Boolean(addresses?.some((a) => isAddressEqual(a, address)));
  const isNotSelected = !isAddressEqual(activeAddress, address);
  const isConnectedAndNotSelected = isConnected && isNotSelected;

  const { kqWallet, privyWallet } = useMemo(() => {
    return {
      privyWallet: wallets.find((w) => isAddressEqual(w.address as Address, address)),
      kqWallet: userMetadata.linkedWallets.find((w) => isAddressEqual(w.address, address)),
    };
  }, [wallets, userMetadata, address]);

  const activateWallet = async () => {
    if (isConnectedAndNotSelected) return;
    if (privyWallet) setActiveWallet(privyWallet).catch((e) => console.error(e));
    else if (kqWallet) {
      const connector = createCustomConnector([address], arbitrum.id);
      connect({ connector });
    } else {
      connectWallet({ description: `Connect ${truncateAddress(address)} wallet` });
    }
  };

  const buttonNode = (
    <button
      disabled={isConnectedAndNotSelected}
      className="btn-secondary px-2 text-base"
      onClick={() => activateWallet()}
      type="button"
    >
      Activate
    </button>
  );

  return (
    <>
      {isConnectedAndNotSelected ? (
        <Tooltip
          tooltipText="Switch to this account from your wallet"
          trigger={<span className="bg-bg-secondary px-2.5 text-primary">Connected</span>}
        />
      ) : (
        buttonNode
      )}
      <div className="mx-1 h-4 w-px bg-outline-major" />
    </>
  );
}

interface UnlinkWalletProps {
  className?: string;
  address: Address;
}

export function UnlinkWallet(props: UnlinkWalletProps) {
  const { className, address } = props;

  const { user, unlinkWallet, canUnlink } = usePrivyAccount();

  const [isLoading, setIsLoading] = useState(false);
  const isLinked = user?.linkedAccounts.some(
    (a) => a.type == "wallet" && isAddressEqual(a.address as Address, address),
  );

  async function onClick() {
    setIsLoading(true);
    await unlinkWallet(address);
    setIsLoading(false);
  }

  if (!user) return null;

  const buttonNode = (
    <button
      className={cn(`flex w-16 items-center justify-center disabled:cursor-not-allowed disabled:opacity-50`, className)}
      disabled={!canUnlink || !isLinked}
      onClick={onClick}
      type="button"
    >
      {isLoading ? <Spinner className="size-4" /> : "Unlink"}
    </button>
  );

  return isLinked ? buttonNode : <Tooltip tooltipText="You can't unlink this wallet" trigger={buttonNode} />;
}

interface LinkWalletProps {
  className?: string;
  address: Address;
}

export function LinkWallet(props: LinkWalletProps) {
  const { className, address } = props;

  const { linkWallet } = usePrivyAccount();

  return (
    <button
      className={cn("w-16 text-center text-primary", className)}
      onClick={() => linkWallet({ suggestedAddress: address })}
      type="button"
    >
      Link
    </button>
  );
}

function TempTxButton() {
  const chainId = useChainId();
  const usdaiAddresses: Record<number, Address> = {
    [arbitrum.id]: "0x0A1a1A107E45b7Ced86833863f482BC5f4ed82EF",
    [sepolia.id]: "0xeb29FbaA2d509E43313C196A82F4ad75Fa251285",
  };
  const usdaiAddress = usdaiAddresses[chainId];
  const handleTx = useHandleTx();

  const { data: approveData, error: approveError } = useContractStaticCall({
    address: usdaiAddress,
    abi: erc20Abi,
    functionName: "approve",
    args: [usdaiAddress, maxUint256],
  });

  console.log({ approveError, approveData });

  const approve = async () => {
    await handleTx({
      title: "Approve",
      params: approveData?.request,
      updateStep: noop,
    });
  };

  return null;
  return (
    <button className="btn-small btn-primary" onClick={() => approve()}>
      Approve
    </button>
  );
}
