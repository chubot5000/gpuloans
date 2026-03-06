"use client";

import assert from "assert";

import { type ChangeEvent, type Ref, useEffect, useState } from "react";

import type { UnstyledInputProps } from "./UnstyledInput";

const NUMBERS_AND_DOT_REGEXP = /^[0-9]*[.]?[0-9]*$/;

const NUMBERS_REGEXP = /[0-9]/;

// Source: @uniswap/interface
function escapeRegExp(string: string): string {
  return string.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

const FLOAT_REGEX = /^\d*(?:\\[.])?\d*$/;
const INT_REGEX = /^[0-9]*$/;

type NumberInputProps = Omit<UnstyledInputProps, "type"> & {
  int?: boolean;
  maxDecimals?: number;
  inputRef?: Ref<HTMLInputElement>;
  value?: string;
};

export function NumberInput(props: NumberInputProps) {
  const { onChange, int, inputRef, maxDecimals = 18, value: propValue, ...rest } = props;

  const [displayValue, setDisplayValue] = useState("");

  assert.ok(maxDecimals <= 18, "maxDecimals must be less than or equal to 18");

  const formatWithCommas = (value: string): string => {
    if (!value) return "";

    const cleanValue = value.replaceAll(",", "");

    if (int) return Number(cleanValue).toLocaleString("en-US");

    const parts = cleanValue.split(".");
    const integerPart = Number(parts[0]).toLocaleString("en-US");

    if (parts.length > 1) return `${integerPart}.${parts[1]}`;

    return integerPart;
  };

  useEffect(() => {
    if (propValue !== undefined) setDisplayValue(formatWithCommas(propValue));
  }, [propValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return;

    const cursorPosition = event.target.selectionStart || 0;

    const commasBefore = (event.target.value.slice(0, Math.max(0, cursorPosition)).match(/,/g) || []).length;

    const inputWithoutCommas = event.target.value.replaceAll(",", "");

    if (inputWithoutCommas === "" || (int ? INT_REGEX : FLOAT_REGEX).test(escapeRegExp(inputWithoutCommas))) {
      const decimalString = inputWithoutCommas.split(".")[1];

      if (decimalString && decimalString.length > maxDecimals) return;

      const formattedValue = formatWithCommas(inputWithoutCommas);
      setDisplayValue(formattedValue);

      onChange(inputWithoutCommas, event);

      setTimeout(() => {
        const newCommasBefore = (formattedValue.slice(0, Math.max(0, cursorPosition)).match(/,/g) || []).length;
        const newPosition = cursorPosition + (newCommasBefore - commasBefore);
        event.target.setSelectionRange(newPosition, newPosition);
      }, 0);
    }
  };

  return (
    <input
      autoComplete="off"
      autoCorrect="off"
      inputMode="decimal"
      maxLength={79}
      minLength={1}
      onChange={handleInputChange}
      pattern={int ? NUMBERS_REGEXP.toString() : NUMBERS_AND_DOT_REGEXP.toString()}
      placeholder={int ? "0" : "0.0"}
      ref={inputRef}
      spellCheck={false}
      type="text"
      value={displayValue}
      {...rest}
    />
  );
}
