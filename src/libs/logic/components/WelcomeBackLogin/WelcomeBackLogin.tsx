"use client";

import { cn } from "logic/utils";

import { ApplicationsLogin } from "./ApplicationsLogin";
import { LoansLogin } from "./LoansLogin";

export function WelcomeBackLogin({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col items-start w-full max-w-4xl mx-auto px-4", className)}>
      {/* Welcome Back Title */}
      <h1 className="text-[32px] font-eiko w-full text-[#655343] mb-12 text-center">Welcome Back</h1>

      {/* Two Column Layout */}
      <div className="flex flex-col items-center md:items-start md:flex-row gap-8 md:gap-12 w-full min-h-78">
        {/* Applications Login Section */}
        <ApplicationsLogin />

        {/* Vertical Divider */}
        <div className="block h-px md:h-full w-full md:w-px bg-outline-major self-stretch" />

        {/* Loans Login Section */}
        <LoansLogin />
      </div>
    </div>
  );
}
