"use client";

import { InformationCircleIcon } from "@heroicons/react/24/outline";
import * as ReactTooltip from "@radix-ui/react-tooltip";
import { cn, printFiat, fromUnits } from "logic/utils";
import { type HTMLAttributes, type PropsWithChildren, type ReactNode, useCallback, useRef, useState } from "react";

export interface TooltipProps {
  trigger: ReactNode;
  tooltipText: ReactNode;
  className?: string;
  contentClassName?: string;
  style?: HTMLAttributes<HTMLSpanElement>["style"];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
  side?: ReactTooltip.TooltipContentProps["side"];
}

export function Tooltip(props: TooltipProps) {
  const { trigger, tooltipText, className, contentClassName, style, isOpen, setIsOpen, side } = props;
  const [internalOpen, setInternalOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const open = isOpen ?? internalOpen;
  const setOpen = setIsOpen ?? setInternalOpen;

  const handleClick = useCallback(() => {
    clearTimeout(timerRef.current);
    setOpen(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = undefined;
      setOpen(false);
    }, 1_000);
  }, [setOpen]);

  if (tooltipText === null) return trigger;

  const handleOpenChange = (val: boolean) => {
    if (!val && timerRef.current) return;
    setOpen(val);
  };

  return (
    <ReactTooltip.Root onOpenChange={handleOpenChange} open={open}>
      <ReactTooltip.Trigger asChild className={cn("inline-flex", className)} style={style}>
        <div className="group w-fit" role="button" tabIndex={0} onClick={handleClick}>
          {trigger}
        </div>
      </ReactTooltip.Trigger>
      <ReactTooltip.Portal>
        <ReactTooltip.Content
          className={cn(
            `z-1005 w-auto max-w-[16rem] bg-bg-page px-4 py-2`,
            "text-start text-xs leading-tight whitespace-pre-wrap",
            "[filter:drop-shadow(0_0_0.5px_var(--color-outline-major))_drop-shadow(0_0_0.5px_var(--color-outline-major))]",
            contentClassName,
          )}
          side={side}
          sideOffset={5}
        >
          <ReactTooltip.Arrow className="fill-bg-page" />
          <span>{tooltipText}</span>
        </ReactTooltip.Content>
      </ReactTooltip.Portal>
    </ReactTooltip.Root>
  );
}

type HelpTooltipProps = PropsWithChildren & Pick<TooltipProps, "side" | "contentClassName" | "className">;

export function HelpTooltip(props: HelpTooltipProps) {
  const { children, className, contentClassName, side } = props;

  return (
    <Tooltip
      className={cn("size-4 cursor-help", className)}
      contentClassName={contentClassName}
      side={side}
      tooltipText={<span>{children}</span>}
      trigger={<InformationCircleIcon className="stroke-2" />}
    />
  );
}

export type AmountTooltipProps = {
  amount: bigint;
  decimals: number;
  className?: string;
};

export function AmountTooltip(props: AmountTooltipProps) {
  const { amount, decimals, className } = props;

  const amountDecimal = fromUnits(amount, decimals);

  return (
    <Tooltip
      className={cn("cursor-default", className)}
      trigger={printFiat(fromUnits(amount, decimals))}
      tooltipText={printFiat(amountDecimal, undefined, { maximumFractionDigits: decimals })}
    />
  );
}

export const TooltipProvider = ReactTooltip.Provider;
