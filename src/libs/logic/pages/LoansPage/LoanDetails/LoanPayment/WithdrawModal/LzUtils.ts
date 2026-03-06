import { Address } from "viem";
import { sepolia, arbitrumSepolia, berachain, arbitrum, mainnet, plasma, base } from "viem/chains";

export const NetworkEids: Record<number, number> = {
  [sepolia.id]: 40161,
  [arbitrumSepolia.id]: 40231,
  [berachain.id]: 30362,
  [arbitrum.id]: 30110,
  [mainnet.id]: 30101,
  [plasma.id]: 30383,
  [base.id]: 30184,
};

export interface SendParam {
  dstEid: number; // Destination endpoint ID.
  to: Address; // Recipient address.
  amountLD: bigint; // Amount to send in local decimals.
  minAmountLD: bigint; // Minimum amount to send in local decimals.
  extraOptions: Address; // Additional options supplied by the caller to be used in the LayerZero message.
  composeMsg: Address; // The composed message for the send() operation.
  oftCmd: Address; // The OFT command to be executed, unused in default OFT implementations.
}

export const TOKENS_ADAPTERS: Record<Address, Address> = {
  // Arbitrum Sepolia USDC
  "0x3253a335e7bffb4790aa4c25c4250d206e9b9773": "0x543bda7c6ca4384fe90b1f5929bb851f52888983",
  // Sepolia USDC
  "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590": "0x4985b8fcea3659fd801a5b857da1d00e985863f0",
  // Arbitrum PYUSD
  "0x46850ad61c2b7d64d08c9c754f45254596696984": "0xfab5891ed867a1195303251912013b92c4fc3a1d",
  // Ethereum PYUSD
  "0x6c3ea9036406852006290770bedfcaba0e23a0e8": "0xa2c323fe5a74adffad2bf3e007e36bb029606444",
};

export const CHAINS_PEER: Record<number, number> = {
  // mainnets
  [arbitrum.id]: mainnet.id,
  [mainnet.id]: arbitrum.id,
  // testnets
  [arbitrumSepolia.id]: sepolia.id,
  [sepolia.id]: arbitrumSepolia.id,
};

export const TOKENS_PEER: Record<Address, Address> = {
  // Sepolia USDC -> Arbitrum Sepolia USDC
  "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590": "0x3253a335e7bffb4790aa4c25c4250d206e9b9773",
  // Arbitrum Sepolia USDC -> Sepolia USDC
  "0x3253a335e7bffb4790aa4c25c4250d206e9b9773": "0x2f6f07cdcf3588944bf4c42ac74ff24bf56e7590",
  // Arbitrum PYUSD -> Ethereum PYUSD
  "0x46850ad61c2b7d64d08c9c754f45254596696984": "0x6c3ea9036406852006290770bedfcaba0e23a0e8",
  // Ethereum PYUSD -> Arbitrum PYUSD
  "0x6c3ea9036406852006290770bedfcaba0e23a0e8": "0x46850ad61c2b7d64d08c9c754f45254596696984",
};
