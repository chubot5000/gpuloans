"use client";

import { cn } from "logic/utils";

import { Navigation } from "./Navigation";
import { ScheduleCall } from "./ScheduleCallSection";

export function ContactPage() {
  return (
    <div className="flex flex-col w-full h-full max-w-12xl md:flex-row">
      <div
        className={cn(
          "flex w-full md:w-1/4 h-min md:h-full bg-brown-900 flex-col",
          "py-5 px-4 md:px-8 md:gap-14 gap-8 min-w-[380px] xl:min-w-[500px]",
        )}
      >
        <Navigation />

        <div className="flex flex-col gap-16 md:gap-32">
          <div className="flex flex-col gap-3.5">
            <h1 className="text-5xl font-medium text-white font-eiko">Contact Us</h1>
            <span className="font-eiko text-5xl italic font-light text-[#E4D7CE] max-md:ml-2">for a quote</span>
          </div>
          <span className="text-base font-light text-[#E4D7CE]">Get GPU loans as low as 7% APR at up to 80% LTV</span>
        </div>
      </div>

      <ScheduleCall className="px-4 py-16 bg-white md:px-10 lg:px-16 md:py-26 md:w-3/4" />
    </div>
  );
}
