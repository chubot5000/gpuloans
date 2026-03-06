"use client";

import { STAGES } from "data/clients/pipedrive/constants.generated";
import { patchDeal } from "data/fetchers";
import { CALENDLY_URL } from "logic/utils";
import { useMemo } from "react";
import { InlineWidget, useCalendlyEventListener } from "react-calendly";

interface CalendlyWidgetProps {
  dealId: number;
  onEventScheduled: (dealId: number) => void;
}

export function CalendlyWidget({ dealId, onEventScheduled }: CalendlyWidgetProps) {
  const prefillData = useMemo(() => {
    return {
      name: localStorage.getItem("name") || undefined,
      email: localStorage.getItem("email") || undefined,
      companyName: localStorage.getItem("companyName") || undefined,
    };
  }, []);

  useCalendlyEventListener({
    onEventScheduled: () => {
      if (dealId) {
        onEventScheduled(dealId);
        patchDeal(dealId, { stage_id: STAGES.INTRO_CALL_SCHEDULED });
      }
    },
  });

  const calendlyUrl = useMemo(() => {
    const url = new URL(CALENDLY_URL);
    if (dealId) url.searchParams.set("utm_content", String(dealId));

    return url.toString();
  }, [dealId]);

  return (
    <InlineWidget
      url={calendlyUrl}
      className="w-full h-auto min-h-[960px] min-[1627px]:min-h-[890px]"
      pageSettings={{
        hideEventTypeDetails: false,
        hideLandingPageDetails: false,
      }}
      prefill={{ name: prefillData.name, email: prefillData.email }}
    />
  );
}
