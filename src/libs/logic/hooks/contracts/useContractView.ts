/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWeb3 } from "logic/components";
import { useIsMounted } from "logic/hooks";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import {
  type Config,
  type ResolvedRegister,
  useReadContract,
  type UseReadContractParameters,
  type UseReadContractReturnType,
} from "wagmi";
import type { ReadContractData } from "wagmi/query";

import { useRefetchOnBlockNumber } from "./useRefetchOnBlockNumber";

export function useContractView<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "pure" | "view">,
  args extends ContractFunctionArgs<abi, "pure" | "view", functionName>,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractData<abi, functionName, args>,
>(
  params: UseReadContractParameters<abi, functionName, args, config, selectData> & {
    watch?: boolean;
    scopeKey?: string;
  } = {} as any,
): UseReadContractReturnType<abi, functionName, args, selectData> {
  const { address, chainId } = useWeb3();
  const isMounted = useIsMounted();

  const enabled = (params.query?.enabled ?? true) && isMounted;

  const result = useReadContract({
    ...params,
    account: address,
    chainId: params.chainId ?? chainId,
    query: {
      ...params.query,
      retry: params.query?.retry ?? false,
      enabled,
    },
    scopeKey: params.scopeKey,
  });

  useRefetchOnBlockNumber({
    chainId,
    enabled: Boolean(enabled && params.watch),
    queryKeyToInvalidate: result.queryKey,
  });

  return result;
}
