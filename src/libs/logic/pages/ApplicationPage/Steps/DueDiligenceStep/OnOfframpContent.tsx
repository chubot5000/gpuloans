"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_FIELD_KEYS, ONRAMP_OFFRAMP } from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import type { StepState } from "logic/components";
import { useApplication } from "logic/pages";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Select } from "ui/components";

import { LockedStep } from "../../components";
import { FormField } from "../../components/FormField";

type OnrampOfframpValue = (typeof ONRAMP_OFFRAMP)[keyof typeof ONRAMP_OFFRAMP];

const HELP_OPTIONS = [
  { label: "Yes", value: "yes" },
  { label: "No", value: "no" },
];

export function OnOfframpContent({ state }: { state: StepState }) {
  const { dealId, dealDetail } = useApplication();
  const queryClient = useQueryClient();

  const currentValue = dealDetail?.custom_fields?.onrampOfframp as OnrampOfframpValue | undefined;

  const [selectedValue, setSelectedValue] = useState<OnrampOfframpValue | null>(null);
  const [needsHelp, setNeedsHelp] = useState<"yes" | "no" | "">("");

  useEffect(() => {
    if (currentValue === ONRAMP_OFFRAMP.Coinbase) {
      setSelectedValue(ONRAMP_OFFRAMP.Coinbase);
      setNeedsHelp("yes");
    } else if (currentValue === ONRAMP_OFFRAMP.No) {
      setSelectedValue(ONRAMP_OFFRAMP.No);
      setNeedsHelp("no");
    }
  }, [currentValue]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (value: OnrampOfframpValue) => {
      await patchDeal(dealId, { custom_fields: { [CUSTOM_FIELD_KEYS.ONRAMP_OFFRAMP]: value } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    },
  });

  const handleHelpChange = (value: string) => {
    const answer = value as "yes" | "no";
    setNeedsHelp(answer);

    if (answer === "yes") {
      setSelectedValue(ONRAMP_OFFRAMP.Coinbase);
    } else {
      setSelectedValue(ONRAMP_OFFRAMP.No);
    }
  };

  const handleSubmit = () => {
    if (selectedValue !== null) mutate(selectedValue);
  };

  const isCompleted = state === "COMPLETED";
  const canSubmit = selectedValue !== null;

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-7 p-8 shadow-base">
      <FormField
        label="Do you need help setting up an on/off-ramp solution?"
        className="flex flex-row flex-wrap justify-between items-center"
        labelClassName="text-text-primary font-normal"
      >
        <Select
          value={needsHelp}
          onChange={handleHelpChange}
          options={HELP_OPTIONS}
          placeholder="Select…"
          className="w-full max-w-xs"
          disabled={isCompleted}
        />
      </FormField>

      {needsHelp === "yes" && (
        <div className="flex flex-col gap-6">
          <p className="flex gap-1.5 items-center text-sm leading-[1.5] tracking-[-0.01em] text-text-primary">
            <Image
              src="/images/coinbase.png"
              draggable={false}
              alt="Coinbase PRIME"
              width={123}
              height={21}
              className="h-[21px] w-auto"
            />
            is our preferred partner. Please complete the steps below.
          </p>

          <ol className="flex flex-col gap-4 text-sm leading-[1.5] tracking-[-0.01em] text-text-primary list-decimal list-inside ml-4">
            <li>
              Navigate to Coinbase&apos;s{" "}
              <Link
                href="https://accounts.coinbase.com/pick-your-account"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-secondary hover:text-primary"
              >
                onboarding portal
              </Link>{" "}
              and select Business {">"} and then the blue &apos;<span className="font-semibold">Get Started</span>&apos;
              button
            </li>
            <li>
              Register for a business account using an email that is unrelated to any existing retail Coinbase account
              (this means you cannot use an email associated with an existing{" "}
              <Link
                href="https://coinbase.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-text-primary hover:text-secondary"
              >
                coinbase.com
              </Link>{" "}
              retail account). Once validated, sign-in.
            </li>
            <li>Set up a new organization</li>
            <li>
              For each entity you will: <span className="font-semibold">Start new application from scratch</span>
            </li>
            <li>
              Select &quot;<span className="font-semibold">Prime</span>&quot; as the product type as you go through the
              application.
            </li>
          </ol>
        </div>
      )}

      <Button
        onClick={handleSubmit}
        className="w-60 btn-primary-light"
        disabled={!canSubmit || isPending || isCompleted}
        isLoading={isPending}
      >
        {needsHelp === "yes" ? "I've Completed the Steps" : "Confirm"}
      </Button>
    </div>
  );
}
