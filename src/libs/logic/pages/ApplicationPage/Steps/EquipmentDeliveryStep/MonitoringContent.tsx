"use client";

import { LinkIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ARAVOLTA, CUSTOM_FIELD_KEYS } from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import { StepState } from "logic/components";
import { useApplication } from "logic/pages";
import { cn } from "logic/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button, Radio } from "ui/components";

import { LockedStep } from "../../components";

const ARAVOLTA_DOCS_URL = "https://aravolta.notion.site/usd-ai";
const ARAVOLTA_WEBSITE_URL = "https://www.aravolta.com";
const ARAVOLTA_X_URL = "https://x.com/aravolta";

type AravoltaOption = "ssh" | "no-ssh";

interface OptionCardProps {
  title: string;
  badge?: { label: string };
  isSelected: boolean;
  onSelect: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

function OptionCard(props: OptionCardProps) {
  const { title, badge, isSelected, onSelect, disabled, children } = props;

  return (
    <div
      className={cn(
        "p-6 bg-white shadow-base border border-transparent overflow-hidden",
        isSelected && "border-primary",
        !disabled && "cursor-pointer",
      )}
      onClick={disabled ? undefined : onSelect}
    >
      <div className="flex gap-3 items-center mb-4">
        <Radio checked={isSelected} onChange={onSelect} disabled={disabled} radioClassName="shrink-0 mt-0.5" />
        <h4 className="text-base font-medium tracking-tight text-text-primary">
          {title}
          {badge && (
            <span className="inline-block align-middle ml-2 px-2.5 py-1.5 text-xs text-white bg-status-green-500 rounded">
              {badge.label}
            </span>
          )}
        </h4>
      </div>
      <div className="ml-8">{children}</div>
    </div>
  );
}

interface MonitoringContentProps {
  state: StepState;
}

export function MonitoringContent(props: MonitoringContentProps) {
  const { state } = props;
  const {
    dealId,
    dealDetail: {
      custom_fields: { dataCenterAddress, dataCenterOperator, location, aravolta },
    },
  } = useApplication();
  const queryClient = useQueryClient();

  const isTodo = state === "TODO";

  const [selectedOption, setSelectedOption] = useState<AravoltaOption | undefined>(() => {
    if (aravolta === ARAVOLTA.SSH) return "ssh";
    if (aravolta === ARAVOLTA["No SSH"]) return "no-ssh";
    return "ssh";
  });

  const { mutate: confirmAddress, isPending } = useMutation({
    mutationFn: async () => {
      const aravoltaValue = selectedOption === "ssh" ? ARAVOLTA.SSH : ARAVOLTA["No SSH"];
      await patchDeal(dealId, { custom_fields: { [CUSTOM_FIELD_KEYS.ARAVOLTA]: aravoltaValue } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deal-detail", dealId] });
    },
  });

  if (state === "UNAVAILABLE") return <LockedStep />;

  return (
    <div className="flex flex-col gap-6">
      {/* Aravolta Info Panel */}
      <div className="flex flex-col gap-3 p-8 bg-bg-primary">
        <div className="flex justify-between items-start">
          <Image src="/images/aravolta.png" alt="Aravolta" width={96} height={48} className="object-contain" />
          <div className="flex gap-3 items-center">
            <a href={ARAVOLTA_WEBSITE_URL} target="_blank" rel="noopener noreferrer" className="text-text-dark-primary">
              <LinkIcon className="size-5" />
            </a>
            <a href={ARAVOLTA_X_URL} target="_blank" rel="noopener noreferrer" className="text-text-dark-primary">
              <svg className="size-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>

        <p className="mb-4 text-sm tracking-tight leading-relaxed text-text-primary">
          Aravolta provides data center infrastructure management (DCIM) software, as well as digital twins, regulatory
          reporting, and autonomous control for data centers.
        </p>

        <p className="text-sm tracking-tight text-text-primary">
          Overview of how the Aravolta Node works:{" "}
          <a
            href={ARAVOLTA_DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline text-secondary hover:text-primary"
          >
            {ARAVOLTA_DOCS_URL}
          </a>
          .
        </p>
      </div>

      <p className="text-sm tracking-tight text-text-primary">Please choose one of the options below.</p>

      <div className="flex flex-col gap-4">
        <OptionCard
          title="Option 1: SSH (temporary, onboarding only)"
          badge={{ label: "Less Work" }}
          isSelected={selectedOption === "ssh"}
          onSelect={() => setSelectedOption("ssh")}
          disabled={!isTodo}
        >
          <ul className="ml-4 text-sm tracking-tight leading-loose list-disc list-outside text-text-primary">
            <li>
              <span className="font-bold">Firewall Rule</span> to allow inbound SSH traffic (TCP port 22) from our
              office IP address, 170.39.169.158, to the static IP assigned to the node. This will only be needed for
              initial onboarding and can be removed after initial onboarding
            </li>
            <li>
              <span className="font-bold">Internal Static IP</span> that will be assigned to the node
            </li>
            <li>
              <span className="font-bold">Subnet Mask</span> of the network (e.g., 255.255.255.0 or /24)
            </li>
            <li>
              <span className="font-bold">Gateway IP</span> address of the network
            </li>
            <li>
              <span className="font-bold">HTTPS Outbound Access</span> for the node to relay telemetry data (port 443)
            </li>
          </ul>
        </OptionCard>

        <OptionCard
          title="Option 2: Preconfigured (no SSH)"
          isSelected={selectedOption === "no-ssh"}
          onSelect={() => setSelectedOption("no-ssh")}
          disabled={!isTodo}
        >
          <ul className="ml-4 text-sm tracking-tight leading-loose list-disc list-outside text-text-primary">
            <li>The Redfish API URL, username, and password of all server BMCs</li>
            <li>HTTPS outbound access for the node to relay telemetry data (port 443)</li>
          </ul>
        </OptionCard>
      </div>

      <div className="flex flex-col gap-6 p-8 bg-white shadow-base">
        <p className="text-sm tracking-tight text-text-primary">
          {isTodo ? "Please confirm Data Center Address:" : "Data Center Address:"}
        </p>

        <div className="flex flex-col gap-5">
          <p className="text-sm font-semibold tracking-tight leading-tight text-text-primary">
            {dataCenterOperator ?? "--"}
          </p>
          <p className="text-sm font-semibold tracking-tight leading-tight text-text-primary">
            {dataCenterAddress?.value ?? "--"} (Data Center address)
          </p>
          <p className="text-sm font-semibold tracking-tight leading-tight text-text-primary">
            {location ?? "--"} (Data Center Country)
          </p>
        </div>

        {isTodo && (
          <Button
            onClick={() => confirmAddress()}
            disabled={!dataCenterAddress || !selectedOption || isPending}
            isLoading={isPending}
            className="w-60 btn-primary-light"
          >
            Confirm
          </Button>
        )}

        <p className="text-sm tracking-tight text-text-primary">
          Please{" "}
          <Link href="mailto:support@gpuloans.com" className="underline text-secondary hover:text-primary">
            contact us
          </Link>{" "}
          if there&apos;s any issue with the information above.
        </p>
      </div>
    </div>
  );
}
