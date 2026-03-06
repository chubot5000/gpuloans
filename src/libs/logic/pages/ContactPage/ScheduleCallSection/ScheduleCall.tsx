"use client";

import { cn } from "logic/utils";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

import { CalendlyWidget } from "./CalendlyWidget";
import { ScheduleForm } from "./ScheduleForm";
import { ThankYou } from "./ThankYou";

interface ScheduleCallProps {
  className?: string;
}

export function ScheduleCall({ className }: ScheduleCallProps) {
  const searchParams = useSearchParams();
  const [scheduledDealId, setScheduledDealId] = useState<number | null>(null);

  const dealId = searchParams.get("deal_id") ? Number(searchParams.get("deal_id")) : null;

  const showCalendly = Boolean(dealId);

  if (scheduledDealId) {
    return (
      <div className={cn("flex flex-col gap-10 items-start w-full h-full bg-white", className)}>
        <ThankYou dealId={scheduledDealId} />
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-10 items-start w-full flex-1 bg-white", className)}>
      <Link
        href="/"
        className="hidden gap-2 items-center transition-colors text-secondary md:flex w-fit hover:text-primary"
      >
        <ChevronLeftIcon className="w-5.5 h-5.5" />
        Back
      </Link>

      <div className="flex flex-col gap-3">
        <h2 className="text-5xl italic font-medium font-eiko text-text-primary">Schedule a Call</h2>
        {!showCalendly && (
          <p className="text-text-secondary">Fill in your details below to schedule a call with our team.</p>
        )}
      </div>

      {dealId ? <CalendlyWidget dealId={dealId} onEventScheduled={setScheduledDealId} /> : <ScheduleForm />}
    </div>
  );
}
