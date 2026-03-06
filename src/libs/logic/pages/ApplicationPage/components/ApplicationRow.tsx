import { cn } from "logic/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

import { type StepStats } from "../core";

interface ApplicationRowProps {
  label: ReactNode;
  number: number;
  stats: StepStats;
  href: string;
  className?: string;
}

export function ApplicationRow(props: ApplicationRowProps) {
  const { label, number, stats, href, className } = props;
  const completedPercent = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0;
  const isCompleted = stats.total > 0 && stats.done === stats.total;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center justify-between hover:bg-bg-primary flex-col md:flex-row gap-4 py-4 not-last:border-b border-outline-minor min-h-20 px-8",
        className,
      )}
    >
      <div className="flex gap-2 items-center w-full md:max-w-64">
        <div className="flex justify-center items-center size-7 bg-bg-secondary">
          <span className="">{number}</span>
        </div>
        <span>{label}</span>
        <div className="flex-grow md:hidden" />
        <ChevronRightIcon className="size-4 text-primary md:hidden" />
      </div>

      <div className="flex flex-1 gap-2 items-center w-full">
        <div className="flex gap-2 justify-end items-center w-full md:gap-4">
          <div className="overflow-hidden relative flex-grow w-full h-2 md:max-w-60 bg-bg-secondary">
            <div className="absolute top-0 left-0 h-full bg-[#81BB70]" style={{ width: `${completedPercent}%` }} />
          </div>

          <span className="text-status-green-500 w-10">{completedPercent}%</span>
        </div>

        <div className="mr-3 ml-5 w-px h-5 md:ml-11 md:mr-8 bg-outline-minor" />

        <div
          className={cn("flex gap-2 items-center whitespace-nowrap w-28 text-primary", {
            "text-outline-major": stats.active === 0 && !isCompleted,
            "text-primary": stats.active > 0 && !isCompleted,
            "text-status-green-500": isCompleted,
          })}
        >
          {isCompleted ? (
            <span>Completed</span>
          ) : (
            <>
              <span>{stats.active}</span>
              <span>To-Do</span>
            </>
          )}
        </div>

        <ChevronRightIcon
          className={cn("size-4 max-md:hidden shrink-0", {
            "text-outline-major": stats.active === 0 && !isCompleted,
            "text-primary": stats.active > 0 && !isCompleted,
            "text-status-green-500": isCompleted,
          })}
        />
      </div>
    </Link>
  );
}
