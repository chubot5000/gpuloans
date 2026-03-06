import { cn } from "logic/utils";
import { ReactNode } from "react";
import { Ty } from "ui/components";

type Metric = {
  label: ReactNode;
  value: ReactNode;
};

interface MetricsCardProps {
  title: ReactNode;
  metrics: [Metric, Metric, Metric];
  variant: "dark" | "light";
  className?: string;
}

export function MetricsCard(props: MetricsCardProps) {
  const { title, metrics, variant, className } = props;

  return (
    <div
      className={cn(
        "p-6 flex flex-col gap-4 min-w-72",
        {
          "dark bg-fill-dark text-text-light-primary": variant == "dark",
          "light bg-bg-primary text-text-primary border border-outline-minor": variant == "light",
        },
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-base [.dark_&]:text-text-light-cream [.light_&]:text-text-secondary">{title}</span>
        {/* <ChevronRightIcon className="w-6 h-6 [.dark_&]:text-bg-primary [.light_&]:text-text-secondary" /> */}
      </div>

      {/* Metric [0] */}
      <div className="flex flex-col gap-2">
        <Ty className="text-2.4xl font-medium" value={metrics[0].value} />
        <Ty className="text-base [.dark_&]:text-text-light-cream [.light_&]:text-text-secondary" value={metrics[0].label} />
      </div>

      <hr className="[.dark_&]:border-text-light-cream [.light_&]:border-outline-minor w-full" />

      <div className="flex gap-4.5 justify-between">
        {/* Metric [1] */}
        <div className="flex gap-2 flex-1 justify-between flex-nowrap">
          <Ty className="[.dark_&]:text-text-light-cream [.light_&]:text-text-secondary" value={metrics[1].label} />
          <Ty className="font-medium" value={metrics[1].value} />
        </div>

        <div className="[.dark_&]:bg-text-light-cream [.light_&]:bg-outline-minor h-auto w-px" />

        {/* Metric [2] */}
        <div className="flex gap-2 flex-1 justify-between flex-nowrap">
          <Ty className="[.dark_&]:text-text-light-cream [.light_&]:text-text-secondary" value={metrics[2].label} />
          <Ty className="font-medium whitespace-nowrap" value={metrics[2].value} />
        </div>
      </div>
    </div>
  );
}
