import { WalletApiRequestSignatureInput } from "@privy-io/node";
import { useAuthorizationSignature } from "@privy-io/react-auth";
import { SignMessageParameters, WriteContractParameters } from "@wagmi/core";
import { useWeb3 } from "logic/components";
import { useCallback, useMemo } from "react";
import { encodeFunctionData } from "viem";

import { sendPrivyTransaction } from "./sendPrivyTransaction";
import { signPrivyMessage } from "./signPrivyMessage";
import { usePrivyUserMetadata } from "./usePrivyUserMetadata";

export function usePrivySignerTxs() {
  const userMetadata = usePrivyUserMetadata();
  const { address } = useWeb3();
  const wallet = useMemo(() => userMetadata?.linkedWallets.find((w) => w.address === address), [userMetadata, address]);
  const { generateAuthorizationSignature } = useAuthorizationSignature();

  const signMessage = useCallback(
    async (params: SignMessageParameters) => {
      if (!wallet) throw new Error("No wallet found");

      const message = params.message.toString();

      const payload: WalletApiRequestSignatureInput = {
        version: 1,
        method: "POST",
        url: `https://api.privy.io/v1/wallets/${wallet.id}/rpc`,
        headers: {
          "privy-app-id": process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
        },
        body: {
          method: "personal_sign",
          chain_type: "ethereum",
          params: {
            message: message,
            encoding: "utf-8",
          },
        },
      };

      const { signature: authSignature } = await generateAuthorizationSignature(payload);

      const signature = await signPrivyMessage({
        message: message,
        walletId: wallet.id,
        signature: authSignature,
      });

      return signature;
    },
    [wallet, generateAuthorizationSignature],
  );
  const sendTransaction = useCallback(
    async (params: WriteContractParameters) => {
      // if (!isAdditionalSigner) throw new Error("Not an additional signer"); // TODO: Uncomment this

      if (!wallet) throw new Error("No wallet found");
      // generate the authorization signature using the payload
      const txData = encodeFunctionData({
        abi: params.abi,
        functionName: params.functionName,
        args: params.args,
      });

      const payload: WalletApiRequestSignatureInput = {
        version: 1,
        method: "POST",
        url: `https://api.privy.io/v1/wallets/${wallet.id}/rpc`,
        headers: {
          "privy-app-id": process.env.NEXT_PUBLIC_PRIVY_APP_ID ?? "",
        },
        body: {
          method: "eth_sendTransaction",
          caip2: `eip155:${params.chainId}`,
          chain_type: "ethereum",
          sponsor: true,
          params: {
            transaction: {
              to: params.address,
              data: txData,
              chain_id: `0x${params.chainId?.toString(16) ?? "0"}`,
              from: address,
              value: `0x${params.value?.toString(16) ?? "0"}`,
            },
          },
        },
      };
      const authSignature = await generateAuthorizationSignature(payload);

      const data = await sendPrivyTransaction({
        walletId: wallet.id,
        txParams: params,
        signature: authSignature.signature,
      });

      return data.hash;
    },
    [generateAuthorizationSignature, address, wallet],
  );

  return { sendTransaction, signMessage };
}
