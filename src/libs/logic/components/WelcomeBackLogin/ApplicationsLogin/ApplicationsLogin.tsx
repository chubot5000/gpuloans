"use client";

import { cn } from "logic/utils";

import { ApplicationsIcon } from "../icons";

import { EmailLogin } from "./EmailLogin";

export function ApplicationsLogin({ className }: { className?: string }) {
  return (
    <div className={cn("flex-1 flex flex-col w-full max-w-md max-h-85", className)}>
      {/* Icon */}
      <div className="flex justify-start mb-4">
        <ApplicationsIcon />
      </div>

      {/* Heading */}
      <h2 className="text-xl font-eiko font-medium mb-2 text-center md:text-left">Email Login</h2>

      {/* Description */}
      <p className="text-sm text-text-dark-secondary font-light tracking-[-0.14px] mb-6 text-center md:text-left">
        For all current applicants, please use your email to sign in.
      </p>

      <div className="flex-grow flex flex-col w-full">
        <EmailLogin />
      </div>
    </div>
  );
}
