"use client";

import { STAGES } from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import type { StepState } from "logic/components";
import { useDealCallStatus } from "logic/hooks";
import { useApplication } from "logic/pages";
import { CALENDLY_URL, getStageIndex } from "logic/utils";
import { useMemo, useCallback } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";
import { Ty } from "ui/components";

interface IntakeCallProps {
  state: StepState;
  onEventScheduled?: () => void;
}

export function IntakeCall(props: IntakeCallProps) {
  const { state, onEventScheduled } = props;
  const { dealDetail } = useApplication();
  const { data: callData, refetch } = useDealCallStatus(dealDetail.id);

  const prefillData = useMemo(() => {
    return { name: "", email: "" };
  }, []);

  const calendlyUrl = useMemo(() => {
    if (!dealDetail.id) return CALENDLY_URL;
    const url = new URL(CALENDLY_URL);
    url.searchParams.set("utm_content", String(dealDetail.id));
    return url.toString();
  }, [dealDetail.id]);

  const handleEventScheduled = useCallback(() => {
    refetch();
    onEventScheduled?.();

    // update stage in Pipedrive
    if (getStageIndex(dealDetail.stage_id) < getStageIndex(STAGES.INTRO_CALL_SCHEDULED)) {
      patchDeal(dealDetail.id, { stage_id: STAGES.INTRO_CALL_SCHEDULED });
    }
  }, [dealDetail.stage_id, dealDetail.id]); // eslint-disable-line react-hooks/exhaustive-deps

  useCalendlyEventListener({
    onEventScheduled: handleEventScheduled,
  });

  if (state === "TODO" || state === "REJECTED") {
    return (
      <>
        {state === "REJECTED" && (
          <span className="text-sm text-text-secondary">
            Call has been cancelled. Please reschedule if you want to continue with the application
          </span>
        )}
        <InlineWidget
          url={calendlyUrl}
          className="[&_iframe]:min-h-[964px] flex-grow"
          pageSettings={{
            hideEventTypeDetails: false,
            hideLandingPageDetails: false,
          }}
          prefill={{ name: prefillData.name, email: prefillData.email }}
        />
      </>
    );
  }

  if (state === "PENDING" && callData?.metadata) {
    return (
      <div className="flex flex-col gap-2 border-outline-minor">
        <Ty
          className="text-sm text-text-secondary"
          value="Call scheduled. To reschedule or cancel, please check your email."
        />

        <Ty className="text-sm text-text-secondary" value={formatDateTime(callData.metadata.scheduled_start)} />
      </div>
    );
  }

  if (state === "COMPLETED") {
    if (callData?.metadata?.scheduled_end) {
      return (
        <Ty
          className="text-sm text-text-secondary"
          value={`Call Completed at ${formatDateTime(callData.metadata.scheduled_end)}`}
        />
      );
    }

    return <Ty className="text-sm text-text-secondary" value="Call completed" />;
  }

  return <Ty className="text-text-secondary" value="This step is not yet available." />;
}

function formatDateTime(isoString: string | undefined): string {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}
