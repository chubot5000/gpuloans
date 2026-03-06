"use client";

import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, SPV_ONE_STOP } from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import { AnimatePresence, motion } from "framer-motion";
import type { StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { cn } from "logic/utils";
import Link from "next/link";
import { useState } from "react";
import { Button, Input, Radio } from "ui/components";

import { LockedStep } from "../../components";

interface SPVFormationProps {
  state: StepState;
}

export function SPVFormation(props: SPVFormationProps) {
  const { state } = props;
  const {
    dealId,
    dealDetail: {
      custom_fields: { spvOneStop, spvLlcName },
    },
  } = useApplication();
  const queryClient = useQueryClient();

  const isTodo = state === "TODO";

  const [selectedOption, setSelectedOption] = useState<"gpuloans" | "self" | undefined>(() => {
    if (isTodo) return undefined;
    if (spvOneStop === SPV_ONE_STOP.GPULoans) return "gpuloans";
    if (spvOneStop === SPV_ONE_STOP.Self) return "self";
  });

  // Draft state pattern: null means "use server value", string means "local edit"
  const [draftName, setDraftName] = useState<string | null>(null);
  const spvUniqueName = draftName ?? spvLlcName ?? "";

  const { mutate: submitSpvFormation, isPending } = useMutation({
    mutationFn: async () => {
      if (!selectedOption) return;

      const value = selectedOption === "gpuloans" ? SPV_ONE_STOP.GPULoans : SPV_ONE_STOP.Self;

      const customFields: Record<string, unknown> = { [CUSTOM_FIELD_KEYS.SPV_ONE_STOP]: value };

      if (selectedOption === "gpuloans" && spvUniqueName.trim()) {
        customFields[CUSTOM_FIELD_KEYS.SPV_LLC_NAME] = spvUniqueName.trim();
      } else if (selectedOption === "self") {
        // Clear the name when user chooses to manage their own SPV
        customFields[CUSTOM_FIELD_KEYS.SPV_LLC_NAME] = null;
      }

      await patchDeal(dealId, { custom_fields: customFields });
    },
    onSuccess: () => {
      setDraftName(null);
      queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    },
  });

  const canSubmit = selectedOption === "self" || (selectedOption === "gpuloans" && spvUniqueName.trim());

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex relative flex-col gap-4">
      <p className="mb-2 text-sm whitespace-pre-wrap text-text-dark-primary">
        As part of the financing process, the relevant GPU collateral will need to be contributed to an SPV LLC that is
        bankruptcy-remote, effectuated through the LLC&apos;s governance documents and the use of an Independent
        Manager.
        <br /> <br />
        In collaboration with our partners, we have put together a &apos;one-stop&apos; SPV process to meet these needs
        for financings in which a US-based SPV will work. It includes SPV formation in Delaware as well as the
        appointment of a Registered Agent and an Independent Manager.
        <br /> <br />
        You may choose to create and manage your own SPV, but must use a reviewed and approved Independent Manager setup
        and LLC Agreement.
      </p>

      <div className="p-6 mx-1 mb-2 bg-white md:p-8 shadow-base">
        <p className="mb-6 text-sm text-text-dark-primary">Do you want GPULoans to help with SPV Formation?</p>

        <FormOptions
          selected={selectedOption}
          onSelect={setSelectedOption}
          value={spvUniqueName}
          onChange={setDraftName}
          disabled={!isTodo}
        />

        {isTodo && (
          <Button
            onClick={() => submitSpvFormation()}
            disabled={!canSubmit || isPending}
            className="min-w-60 btn-primary-light"
          >
            {isPending ? "Submitting…" : "Submit"}
          </Button>
        )}
      </div>

      <p className="text-sm text-text-dark-primary">
        If you have any questions, please don&apos;t hesitate to reach out to Sam at{" "}
        <Link href="mailto:sam.levine@gpuloans.com" className="underline text-secondary">
          sam.levine@gpuloans.com.
        </Link>
      </p>

      <hr className="my-2 border-outline-minor" />

      <p className="text-sm text-text-dark-primary">
        You can download and view the set of SPV LLC Formation documents here:
      </p>
      <a
        href="/downloads/origination_spv_docs.zip"
        download="SPV_LLC_Formation_Documents.zip"
        className="w-fit inline-flex items-center gap-1.5 text-sm text-secondary border-b border-secondary hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary"
      >
        SPV LLC Formation Documents
        <ArrowDownTrayIcon className="size-4" aria-hidden="true" />
      </a>
    </div>
  );
}

interface FormOptionsProps {
  selected: "gpuloans" | "self" | undefined;
  onSelect: (option: "gpuloans" | "self") => void;
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

function FormOptions(props: FormOptionsProps) {
  const { selected, onSelect, value, onChange, disabled } = props;

  return (
    <div className="flex flex-col gap-6 mb-6">
      <Radio
        label="Yes, I would like to proceed with the process GPULoans offers"
        name="spvFormation"
        checked={selected === "gpuloans"}
        onChange={() => onSelect("gpuloans")}
        className="[&>*]:text-sm"
        disabled={disabled}
      />

      <AnimatePresence initial={false}>
        {selected === "gpuloans" && <NameInput value={value} onChange={onChange} disabled={disabled} />}
      </AnimatePresence>

      <Radio
        label="No thanks, I will find my own solution."
        name="spvFormation"
        checked={selected === "self"}
        onChange={() => onSelect("self")}
        className="[&>*]:text-sm"
        disabled={disabled}
      />
    </div>
  );
}

interface NameInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

function NameInput(props: NameInputProps) {
  const { value, onChange, disabled } = props;

  return (
    <motion.div
      className="overflow-hidden motion-reduce:transition-none"
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25, ease: "easeInOut" }}
    >
      <div className="p-4 ml-0 border md:p-6 md:ml-8 border-outline-minor">
        <label htmlFor="spv-name" className="block mb-4 text-sm text-text-dark-primary">
          Please choose a unique name for the SPV
        </label>
        <div className="flex flex-col gap-4 mb-4 md:gap-6 md:items-center md:flex-row">
          <Input
            id="spv-name"
            name="spvName"
            autoComplete="off"
            value={value}
            onChange={onChange}
            placeholder="Unique Name…"
            className={cn(
              "w-full max-w-sm border-0 border-b border-outline-major bg-bg-primary",
              disabled && "opacity-50",
            )}
            disabled={disabled}
          />
          <Link
            href="https://icis.corp.delaware.gov/ecorp/entitysearch/namesearch.aspx"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#3982c2] underline hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3982c2]"
          >
            Check for Available Names
          </Link>
        </div>
        <p className="text-sm text-text-dark-primary">
          You will receive the full document packet for execution in 1-2 days.
        </p>
      </div>
    </motion.div>
  );
}
