export function usePrivySignerTxs() {
  return {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendTransaction: async (..._args: any[]): Promise<any> => { throw new Error("Wallet not connected"); },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    signMessage: async (..._args: any[]): Promise<any> => { throw new Error("Wallet not connected"); },
  };
}
