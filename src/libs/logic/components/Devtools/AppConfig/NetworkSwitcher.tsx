import { envChains } from "data/rpc";
import { useWeb3 } from "logic/components";
import { cn } from "logic/utils";

export function NetworkSwitcher() {
  const { chainId } = useWeb3();

  return (
    <div className="flex items-center justify-between gap-2">
      <span>Network</span>
      <div className="flex gap-1">
        {envChains.map((chain) => (
          <button
            key={chain.id}
            className={cn(
              "rounded-md px-3 py-1 text-sm transition",
              chain.id === chainId ? "bg-primary text-white" : "bg-stone-200 hover:bg-stone-300",
            )}
            type="button"
          >
            {chain.name}
          </button>
        ))}
      </div>
    </div>
  );
}
