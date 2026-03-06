import type { DOMAttributes, InputHTMLAttributes, Ref, SyntheticEvent } from "react";

import { NumberInput } from "./NumberInput";

type HTMLInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "value">;

export type UnstyledInputProps = HTMLInputProps & {
  type?: "text" | "number" | "integer";
  inputRef?: Ref<HTMLInputElement>;
  maxDecimals?: number;
  value: string;
  onChange: (value: string, e: SyntheticEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
};

export function UnstyledInput(props: UnstyledInputProps) {
  const { type = "text", inputRef, maxDecimals, onChange, onEnter, onKeyDown, ...rest } = props;

  const _onKeyDown: DOMAttributes<HTMLInputElement>["onKeyDown"] = (e) => {
    onKeyDown?.(e);
    if (e.key == "Enter") onEnter?.();
  };

  if (type == "text") {
    return (
      <input
        autoComplete="off"
        onChange={(e) => onChange(e.target.value, e)}
        onKeyDown={_onKeyDown}
        ref={inputRef}
        {...rest}
      />
    );
  }

  return (
    <NumberInput
      inputRef={inputRef}
      int={type == "integer"}
      maxDecimals={maxDecimals}
      onChange={onChange}
      onKeyDown={_onKeyDown}
      {...rest}
    />
  );
}
