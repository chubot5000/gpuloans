"use client";

import { cn } from "logic/utils";
import { CircleProgress } from "ui/components";

import { useApplication } from "../ApplicationPageProvider";

interface ProgressCardProps {
  className?: string;
}

export function ProgressCard(props: ProgressCardProps) {
  const { className } = props;
  const {
    taskProgress: { total, done: complete, active },
  } = useApplication();

  const unavailable = total - complete - active;

  const completePercent = total > 0 ? (complete / total) * 100 : 0;
  const activePercent = total > 0 ? (active / total) * 100 : 0;

  return (
    <div
      className={cn(
        "border border-outline-minor py-5 px-8 flex gap-6 md:gap-12 lg:gap-3 items-center justify-center",
        className,
      )}
    >
      <CircleProgress
        className="w-auto min-w-44"
        value={completePercent}
        segments={[
          { percentage: completePercent, color: "#81BB70" },
          { percentage: activePercent, color: "#655343" },
        ]}
      />

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-2">
          <div className="size-3 bg-status-green-300" />
          <span className="text-text-dark-secondary whitespace-nowrap">Complete [{complete}]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 bg-fill-primary" />
          <span className="text-text-dark-secondary whitespace-nowrap">To-Do [{active}]</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="size-3 bg-bg-secondary" />
          <span className="text-text-dark-secondary whitespace-nowrap">Locked [{unavailable}]</span>
        </div>
      </div>
    </div>
  );
}
