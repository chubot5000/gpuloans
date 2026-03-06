import { useWeb3 } from "logic/components";
import { ERC20 } from "logic/pages/LoansPage/data";
import { Address } from "viem";

import { useWithdrawTx } from "../WithdrawModal/useWithdrawTx";

interface useBridgeTxParams {
  token: ERC20;
  chainId: number;
  amount: bigint;
}

export function useBridgeTx(params: useBridgeTxParams) {
  const { token, chainId, amount } = params;
  const { address: connectedAddress } = useWeb3();

  return useWithdrawTx({
    amount,
    token,
    chainId,
    recipient: connectedAddress as Address,
    mainActionLabel: "Bridge",
  });
}
