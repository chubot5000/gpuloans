"use client";

import { NDA_STATUS } from "data/clients/pipedrive/constants.generated";
import { useDealCallStatus } from "logic/hooks";
import { useApplication } from "logic/pages/ApplicationPage/ApplicationPageProvider";
import { TaskId } from "logic/pages/ApplicationPage/core/constants";
import { formatLocalDateTime } from "logic/utils";
import {
  CalendarIcon,
  CheckCircleIcon,
  EarthIcon,
  ExternalLinkIcon,
  type LucideIcon,
  UserIcon,
  VideoIcon,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Logo } from "ui/assets";
import { Modal, Spinner } from "ui/components";

import { TEMPLATES_DOCS } from "../Steps";

const TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone.replace("_", "/") || "UTC";

export function CalendlyInfoModal() {
  const { dealDetail, callStatus, backendOverrides, dealId } = useApplication();
  const { data, isLoading } = useDealCallStatus(dealId);

  const callOverride = backendOverrides?.[TaskId.CALL];
  const isCallCompleted = callOverride != null ? callOverride === "COMPLETED" : callStatus === "completed";

  const ndaOverride = backendOverrides?.[TaskId.NDA];
  const isNdaExecuted =
    ndaOverride != null
      ? ndaOverride === "COMPLETED"
      : dealDetail.custom_fields.ndaStatus === NDA_STATUS["Fully Executed"];

  const shouldShowModal = !isCallCompleted || !isNdaExecuted;

  if (!shouldShowModal) return null;

  if (isLoading) {
    return (
      <Modal isOpen className="flex justify-center items-center min-w-80 min-h-60">
        <Spinner className="w-8 h-8" />
      </Modal>
    );
  }

  const { event_name, invitee_name, scheduled_start, scheduled_end } = data?.metadata ?? {};

  return (
    <Modal isOpen className="w-full max-w-2xl items-center text-center gap-4.5 md:!p-16" dialogClassName="z-40">
      <div className="flex flex-col gap-5 items-center px-5 py-5 mt-6 w-full rounded-2xl border md:gap-7 border-outline-minor md:py-10 md:px-20">
        <Logo variant="dark" className="h-8 md:h-10" />

        <div className="flex gap-2 items-center">
          <CheckCircleIcon className="size-5.5 text-[#0069FF]" />
          <h2 className="font-bold text-text-dark-primary">You are scheduled</h2>
        </div>

        <div className="flex flex-col gap-3 p-5 w-full text-left rounded-lg border border-outline-minor">
          <h4 className="text-lg font-semibold text-text-dark-primary">{event_name || "Intake Call"}</h4>

          {invitee_name && <DetailRow icon={UserIcon}>{invitee_name}</DetailRow>}
          {scheduled_start && (
            <DetailRow icon={CalendarIcon}>{formatLocalDateTime(scheduled_start, scheduled_end)}</DetailRow>
          )}
          <DetailRow icon={EarthIcon}>{TIMEZONE}</DetailRow>
          <DetailRow icon={VideoIcon}>Web conferencing details to follow.</DetailRow>
        </div>
      </div>
      <div className="flex flex-col gap-3 w-full text-sm font-light text-left text-text-dark-secondary">
        <p>
          Prior to the call, please sign our{" "}
          <Link
            href={TEMPLATES_DOCS[TaskId.NDA]!.docURLs[0]}
            className="text-[#4BA3E3] hover:underline inline-flex items-center gap-1"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="NDA"
          >
            MNDA on Docusign <ExternalLinkIcon className="w-4 h-4" />
          </Link>
        </p>

        <p>
          Please contact{" "}
          <Link href="mailto:hello@gpuloans.com" className="text-text-dark-primary hover:underline">
            hello@gpuloans.com
          </Link>{" "}
          with any questions.
        </p>
      </div>
    </Modal>
  );
}

interface DetailRowProps {
  icon: LucideIcon;
  children: ReactNode;
}

function DetailRow(props: DetailRowProps) {
  const { icon: Icon, children } = props;

  return (
    <div className="flex items-center gap-2 text-sm text-[#737373]">
      <Icon className="w-4 h-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
