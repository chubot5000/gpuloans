import { Children, ReactNode } from "react";
import { Ty } from "ui/components";

interface StepSectionProps {
  title: string;
  children: ReactNode;
}

export function StepSection(props: StepSectionProps) {
  const { title, children } = props;
  const hasChildren = Children.count(children) > 0;

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <Ty className="text-text-secondary text-sm font-medium" value={title} />
        <div className="flex-1 h-px bg-outline-minor" />
      </div>
      <div className="flex flex-col gap-3">
        {hasChildren ? (
          children
        ) : (
          <div className="w-full bg-bg-primary py-3 px-4 md:py-4 md:px-6">
            <span className="text-text-dark-secondary text-sm">No available steps to complete at this time.</span>
          </div>
        )}
      </div>
    </div>
  );
}
