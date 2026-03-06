"use client";

import { truncateAddress } from "logic/utils";
import { DramaIcon } from "lucide-react";
import { useRef, useState } from "react";
import { Button, Input, Modal } from "ui/components";
import { isAddress } from "viem";

import { useDevtools } from "./DevtoolsProvider";

export function ImpersonatorModal() {
  const { isImpersonatorOpen, setIsImpersonatorOpen, impersonatedAddress, setImpersonatedAddress } = useDevtools();

  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = [
    "0x7781149a2ca561bf0f5b3ca03071b364f8b71e72", // Andrew
    "0x66ceac5ee8f093059c4bc9628c06e63076505b15", // Conor
    "0x323803eebe4522879147e78860f5a3f8561c9b41", // Conor -- borrower
    "0xF2391397Fa352cad37023731d37B8013C87592C1", // test
  ];

  function onSubmit(address?: string) {
    if (address) setInputValue(address);

    const value = address ?? inputValue;
    if (isAddress(value)) {
      setImpersonatedAddress(value);
      setIsImpersonatorOpen(false);
    }
  }

  return (
    <Modal
      key="impersonator-modal"
      initialFocus={inputRef}
      isOpen={isImpersonatorOpen}
      onClose={() => setIsImpersonatorOpen(false)}
    >
      <Modal.Title className="mb-8 text-primary">
        <DramaIcon className="mr-2 inline size-[1em]" /> Impersonate
      </Modal.Title>

      <Modal.Children>
        <div className="flex flex-col gap-4">
          <Input
            error={inputValue && !isAddress(inputValue) ? "Invalid address" : undefined}
            inputRef={inputRef}
            onChange={setInputValue}
            onEnter={onSubmit}
            onFocus={(e) => e.target.select()}
            type="text"
            value={inputValue}
            placeholder="0x..."
          />

          <div className="flex flex-col gap-1">
            {presets.map((preset) => (
              <button
                key={preset}
                className="text-sm text-left text-primary underline hover:no-underline"
                onClick={() => onSubmit(preset)}
                type="button"
              >
                {truncateAddress(preset)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4">
          <Button className="w-20 btn-secondary" disabled={!isAddress(inputValue)} onClick={() => onSubmit()}>
            Save
          </Button>

          {impersonatedAddress ? (
            <Button
              className="w-20 bg-red-500 hover:bg-red-400"
              onClick={() => {
                setImpersonatedAddress(undefined);
                setIsImpersonatorOpen(false);
              }}
            >
              Clear
            </Button>
          ) : null}
        </div>
      </Modal.Children>
    </Modal>
  );
}
