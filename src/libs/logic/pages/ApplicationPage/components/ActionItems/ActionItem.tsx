"use client";

import { StepState, TaskType, ApplicationStepIcons } from "logic/components";
import { cn } from "logic/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

interface ActionItemProps {
  type: TaskType;
  state: StepState;
  title: ReactNode;
  href: string;
  className?: string;
}

export function ActionItem(props: ActionItemProps) {
  const { type, state, title, href, className } = props;
  return (
    <Link
      href={href}
      className={cn(
        "bg-white py-3.5 px-4 flex justify-between group border border-outline-minor min-h-28 min-w-72",
        "hover:shadow-base my-1.5 mx-1",
        className,
        {
          "state-todo-container": state === "TODO",
          "state-pending-container": state === "PENDING" || state === "UW_COMMENTS",
        },
      )}
    >
      <div className="flex flex-col gap-3 items-start">
        <ApplicationStepIcons type={type} className="p-2 state-item size-8" iconClassName="size-4" />
        <p className="">{title}</p>
      </div>

      <ChevronRightIcon className="size-5 text-primary" />
    </Link>
  );
}
