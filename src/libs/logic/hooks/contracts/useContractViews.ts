/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type { ReadContractsData } from "@wagmi/core/query";
import { useWeb3 } from "logic/components";
import {
  type Config,
  type ResolvedRegister,
  useReadContracts,
  type UseReadContractsParameters,
  type UseReadContractsReturnType,
} from "wagmi";

import { useIsMounted } from "../useIsMounted";

import { useRefetchOnBlockNumber } from "./useRefetchOnBlockNumber";

export function useContractViews<
  const contracts extends readonly unknown[],
  allowFailure extends boolean = true,
  config extends Config = ResolvedRegister["config"],
  selectData = ReadContractsData<contracts, allowFailure>,
>(
  params: UseReadContractsParameters<contracts, allowFailure, config, selectData> & {
    watch?: boolean;
  } = {},
): UseReadContractsReturnType<contracts, allowFailure, selectData> {
  const { chainId } = useWeb3();
  const isMounted = useIsMounted();

  const enabled = (params.query?.enabled ?? true) && isMounted;

  // set default chain id
  const contracts: typeof params.contracts = params.contracts ? ([...params.contracts] as any) : undefined;
  contracts?.forEach((c: any) => {
    c.chainId ??= chainId;
  });

  const result = useReadContracts({
    ...params,
    contracts,
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
