"use client";

import { cn, type PolymorphProps } from "logic/utils";
import type { ElementType } from "react";
import { Spinner } from "ui/components";

export type ButtonProps<T extends ElementType> = PolymorphProps<T, { isLoading?: boolean }>;

export function Button<T extends ElementType = "button">(props: ButtonProps<T>) {
  const { as: Component = "button", isLoading, disabled, className, children, ...rest } = props;

  return (
    <Component
      type={Component == "button" ? "button" : undefined}
      {...rest}
      className={cn(`btn btn-normal btn-primary outline-hidden disabled:cursor-not-allowed`, className)}
      disabled={isLoading || disabled}
    >
      {isLoading ? <Spinner className="size-4" /> : children}
    </Component>
  );
}
