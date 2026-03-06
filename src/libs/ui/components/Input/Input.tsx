"use client";

import { cn } from "logic/utils";
import { type ReactNode, type Ref, useEffect, useRef } from "react";

import { InputWrapper } from "./InputWrapper";
import { UnstyledInput, type UnstyledInputProps } from "./UnstyledInput";

export type InputProps = UnstyledInputProps & {
  leading?: ReactNode;
  trailing?: ReactNode;
  error?: ReactNode;
  showErrorLabel?: boolean;
  inputClassName?: string;
  componentRef?: Ref<HTMLInputElement>;
};

export function Input(props: InputProps) {
  const {
    className,
    componentRef,
    inputRef: externalInputRef,
    leading,
    trailing,
    error,
    showErrorLabel = true,
    inputClassName,
    disabled,
    ...rest
  } = props;

  const internalInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof externalInputRef == "string") throw new Error("found a string ref");
    else if (typeof externalInputRef == "function") externalInputRef(internalInputRef.current);
    else if (externalInputRef) Object.assign(externalInputRef, { current: internalInputRef.current });
  }, [internalInputRef.current]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <InputWrapper
      className={cn(
        {
          "!border-red-500": error != undefined,
          "bg-white dark:bg-bg-page": !disabled,
          "cursor-not-allowed bg-bg-secondary dark:bg-stone-200": Boolean(disabled),
        },
        className,
      )}
      componentRef={componentRef}
      onClick={() => internalInputRef.current?.focus()}
    >
      {leading}

      <UnstyledInput
        className={cn(
          "w-0 min-w-0 grow bg-transparent tracking-[-0.01em] outline-hidden px-4 py-1.5",
          `placeholder:text-text-secondary dark:placeholder:text-outline-major`,
          "disabled:cursor-not-allowed disabled:placeholder:text-text-secondary",
          `border-none focus:ring-0 dark:disabled:bg-stone-200 dark:disabled:placeholder:text-stone-500`,
          { "font-semibold": Boolean(rest.value) },
          inputClassName,
        )}
        disabled={disabled}
        inputRef={internalInputRef}
        {...rest}
      />

      {trailing}

      {error && showErrorLabel ? (
        <span className="absolute left-2 top-11 text-sm text-red-400 dark:text-red-300">{error}</span>
      ) : null}
    </InputWrapper>
  );
}
