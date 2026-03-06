import { zodHex } from "data/utils";
import { OAdapterAbi } from "logic/pages/LoansPage/contracts";
import {
  BaseError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  decodeErrorResult,
  type DecodeErrorResultReturnType,
  UserRejectedRequestError,
} from "viem";

export function isContractError(error: unknown) {
  return Boolean(error && !(error instanceof BaseError && error.walk((e) => e instanceof UserRejectedRequestError)));
}

export function getContractErrorName(error: unknown) {
  if (error == undefined) return;
  if (typeof error == "string") return error;

  if (error instanceof BaseError) {
    let errorName: string | undefined;

    errorName = getExecutionError(error);
    errorName ??= getRevertError(error);
    errorName = getRequestRejectedError(error) ?? errorName;

    return errorName ?? "Unknown error";
  }

  if (error instanceof Error) return error.name;

  return "Unknown error";
}

function getExecutionError(error: BaseError) {
  const executionError = error.walk((e) => e instanceof ContractFunctionExecutionError);

  if (executionError instanceof ContractFunctionExecutionError) {
    const revertedError = executionError.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revertedError instanceof ContractFunctionRevertedError) {
      const walkedError = walkRawError(revertedError.raw);

      if (walkedError?.abiItem.type === "error" && walkedError.abiItem.inputs?.[0]?.name === "message")
        return walkedError?.args?.[0] as string;

      return walkedError?.errorName;
    }

    return executionError.shortMessage;
  }
}

function getRevertError(error: BaseError) {
  const revertedError = error.walk((e) => e instanceof ContractFunctionRevertedError);
  if (revertedError instanceof ContractFunctionRevertedError) {
    return (
      revertedError.data?.errorName ??
      `Unknown error ${revertedError.signature ? `: (${revertedError.signature})` : ""}`
    );
  }
}

function getRequestRejectedError(error: BaseError) {
  const rejectedError = error.walk((e) => e instanceof UserRejectedRequestError);
  if (rejectedError) return "Request rejected";
}

function walkRawError(data: unknown): DecodeErrorResultReturnType | null {
  try {
    const hexData = zodHex.parse(data);
    const decoded = decodeErrorResult({
      data: hexData,
      abi: OAdapterAbi,
    });

    const walkResult = walkRawError(decoded.args[0]);

    return walkResult || decoded;
  } catch {
    return null;
  }
}
