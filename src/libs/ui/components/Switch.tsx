"use client";

import { motion } from "framer-motion";
import { cn } from "logic/utils";

export interface SwitchOption<T extends string | number> {
  readonly value: T;
  readonly label: string;
}

export interface SwitchProps<T extends string | number> {
  options: readonly [SwitchOption<T>, SwitchOption<T>];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
}

export function Switch<T extends string | number>(props: SwitchProps<T>) {
  const { options, value, onChange, disabled, className } = props;

  const activeIndex = options.findIndex((option) => option.value === value);

  return (
    <div className={cn("relative flex w-full h-10 p-1 gap-1 border border-outline-major overflow-hidden", className)}>
      <motion.div
        className="absolute top-1 bottom-1 bg-fill-secondary"
        initial={false}
        animate={{ x: activeIndex === 0 ? 0 : "calc(100% + 4px)" }}
        style={{ left: 4, width: "calc(50% - 6px)" }}
        transition={{ type: "tween", duration: 0.15, ease: "easeOut" }}
      />

      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => !disabled && onChange(option.value)}
          className={cn(
            "relative z-10 flex-1 h-full flex items-center justify-center px-2.5 text-sm transition-colors",
            value === option.value ? "text-bg-page" : "text-text-dark-secondary",
            disabled && "cursor-not-allowed",
            !disabled && value !== option.value && "hover:text-text-dark-primary",
          )}
          disabled={disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
