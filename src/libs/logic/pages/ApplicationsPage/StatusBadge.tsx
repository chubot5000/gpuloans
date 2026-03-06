import { cn } from "logic/utils";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalizedStatus = status.toLowerCase();

  let label: string;
  let textColor: string;
  let bgColor: string;

  switch (true) {
    case normalizedStatus.includes("won"): {
      label = "Won";
      bgColor = "bg-status-green-50";
      textColor = "text-status-green-500";
      break;
    }
    case normalizedStatus.includes("lost"): {
      label = "Lost";
      bgColor = "bg-status-red-50";
      textColor = "text-status-red-500";
      break;
    }
    default: {
      label = "In Progress";
      bgColor = "bg-status-orange-50";
      textColor = "text-status-orange-500";
      break;
    }
  }

  return (
    <div className={cn("flex h-6 w-fit flex-row items-center gap-2 rounded-sm px-2.5 text-sm", textColor, bgColor)}>
      {label}
    </div>
  );
}
