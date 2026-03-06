"use client";

import { LockIcon } from "lucide-react";

interface LockedStepProps {
  message?: string;
}

export function LockedStep({ message = "This step is locked" }: LockedStepProps) {
  return (
    <div className="flex gap-2 items-center px-4 h-11 bg-bg-primary">
      <LockIcon className="size-4 shrink-0 text-text-secondary" />
      <span className="text-sm tracking-tight text-text-secondary">{message}</span>
    </div>
  );
}
