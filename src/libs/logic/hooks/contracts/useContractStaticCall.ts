/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useWeb3 } from "logic/components";
import { useIsMounted } from "logic/hooks";
import type { Abi, ContractFunctionArgs, ContractFunctionName } from "viem";
import {
  type Config,
  type ResolvedRegister,
  useSimulateContract,
  type UseSimulateContractParameters,
  type UseSimulateContractReturnType,
} from "wagmi";
import type { SimulateContractData } from "wagmi/query";

import { useRefetchOnBlockNumber } from "./useRefetchOnBlockNumber";

export function useContractStaticCall<
  const abi extends Abi | readonly unknown[],
  functionName extends ContractFunctionName<abi, "nonpayable" | "payable">,
  args extends ContractFunctionArgs<abi, "nonpayable" | "payable", functionName>,
  config extends Config = ResolvedRegister["config"],
  chainId extends config["chains"][number]["id"] | undefined = undefined,
  selectData = SimulateContractData<abi, functionName, args, config, chainId>,
>(
  params: UseSimulateContractParameters<abi, functionName, args, config, chainId, selectData> & {
    watch?: boolean;
    scopeKey?: string;
  } = {} as any,
): UseSimulateContractReturnType<abi, functionName, args, config, chainId, selectData> {
  const { address, chainId: _chainId } = useWeb3();
  const isMounted = useIsMounted();

  const chainId = params.chainId ?? _chainId;

  const enabled = (params.query?.enabled ?? true) && isMounted;

  const { watch, ...rest } = params;

  //@ts-expect-error no idea why this is needed
  const result = useSimulateContract({
    ...rest,
    account: address,
    chainId,
    query: {
      ...params.query,
      retry: params.query?.retry ?? false,
      enabled: (params.query?.enabled ?? true) && isMounted,
    },
    scopeKey: params.scopeKey,
  });

  console.log(result);

  useRefetchOnBlockNumber({
    chainId,
    enabled: Boolean(enabled && watch),
    queryKeyToInvalidate: result.queryKey,
  });

  return result;
}
