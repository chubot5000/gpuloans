import { Address } from "viem";
import { arbitrum, sepolia } from "viem/chains";

type LoanAddressesEntry = {
  sUSDai: Address;
  usdai: Address;
  depositTimelock: Address;
  loanRouter: Address;
  bundleCW: Address;
  simpleInterestRateModel: Address;
  amortizedInterestRateModel: Address;
};

export const LOAN_ADDRESSES: Record<number, LoanAddressesEntry> = {
  [sepolia.id]: {
    sUSDai: "0x1897bc1717d4ad5abcfa2ee47edb3265e9f4fd7c",
    usdai: "0xeb29fbaa2d509e43313c196a82f4ad75fa251285",
    depositTimelock: "0x43E595A3654F12C8037b9C83F6112f947A11485C",
    loanRouter: "0x399089e1D8a1a30E6A497f5885147A807B998183",
    bundleCW: "0x1AF7C21bB3abE1Adc33b941D1Aee2a83848C8DEE",
    simpleInterestRateModel: "0x2dBb440a0b53AB5C4144E79042FB5Bd34016a0aC",
    amortizedInterestRateModel: "0x0c6A2187579680F47A014A72F9e7A202E3cEeB3e",
  },
  [arbitrum.id]: {
    sUSDai: "0x0b2b2b2076d95dda7817e785989fe353fe955ef9",
    usdai: "0x0a1a1a107e45b7ced86833863f482bc5f4ed82ef",
    depositTimelock: "0x0D710CC05f34d2eaD9fbA3c78d53d76a0623c9F8",
    loanRouter: "0x0C2ED170F2bB1DF1a44292Ad621B577b3C9597D1",
    bundleCW: "0x80E3146FB2328fE1b79f92F5a3a6bF35515AEe37",
    simpleInterestRateModel: "0xEA0eae46bC15cd975F0545ba35584D96c7b35A1e",
    amortizedInterestRateModel: "0xe01520FD4F249efa4d905F60b6b54E2ade6fA18D",
  },
};
