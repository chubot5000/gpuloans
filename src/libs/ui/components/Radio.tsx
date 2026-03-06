"use client";

import { cn } from "logic/utils";
import { type InputHTMLAttributes, type ReactNode, forwardRef } from "react";

const sizeClasses = {
  sm: { outer: "size-4", inner: "size-2.5" },
  md: { outer: "size-5", inner: "size-3.5" },
  lg: { outer: "size-6", inner: "size-4" },
};

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size"> {
  label?: ReactNode;
  labelClassName?: string;
  radioClassName?: string;
  containerClassName?: string;
  size?: keyof typeof sizeClasses;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(props, ref) {
  const {
    label,
    labelClassName,
    radioClassName,
    containerClassName,
    className,
    disabled,
    size = "md",
    ...rest
  } = props;

  const { outer, inner } = sizeClasses[size];

  return (
    <div className={cn("flex flex-col", containerClassName)}>
      <label
        className={cn(
          "flex items-center gap-3 cursor-pointer",
          { "cursor-not-allowed opacity-60": disabled },
          className,
        )}
      >
        <div className={cn("relative shrink-0", outer)}>
          <input ref={ref} type="radio" disabled={disabled} className={cn("peer sr-only", radioClassName)} {...rest} />
          <div
            className={cn(
              "absolute inset-0 border border-solid",
              "border-outline-major peer-checked:border-primary",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2",
              "peer-disabled:border-stone-400 peer-disabled:cursor-not-allowed",
              "transition-colors duration-150",
            )}
          />
          <div
            className={cn(
              "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
              inner,
              "bg-primary transition-opacity duration-150",
              "peer-checked:opacity-100 opacity-0",
              "peer-disabled:bg-stone-400",
            )}
          />
        </div>

        {label && <span className={cn("text-base text-text-primary", labelClassName)}>{label}</span>}
      </label>
    </div>
  );
});
