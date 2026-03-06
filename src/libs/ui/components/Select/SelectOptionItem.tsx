import { cn } from "logic/utils";
import { ReactNode } from "react";

export interface SelectOption {
  value: string;
  label: string;
  suffix?: ReactNode;
}

interface SelectOptionItemProps {
  id?: string;
  option: SelectOption;
  isSelected: boolean;
  isHighlighted?: boolean;
  onSelect: (value: string) => void;
}

export function SelectOptionItem(props: SelectOptionItemProps) {
  const { id, option, isSelected, isHighlighted = false, onSelect } = props;

  return (
    <button
      id={id}
      className={cn(
        "w-full px-4 py-3 text-left text-text-secondary transition-colors flex items-center justify-between",
        "hover:bg-bg-secondary focus:bg-bg-secondary outline-none",
        isHighlighted && "bg-bg-secondary",
        isSelected && "bg-bg-primary font-medium text-primary",
      )}
      onClick={() => onSelect(option.value)}
      type="button"
      role="option"
      aria-selected={isSelected}
    >
      <span>{option.label}</span>
      {option.suffix}
    </button>
  );
}
