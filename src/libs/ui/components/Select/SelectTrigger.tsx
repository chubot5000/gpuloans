import { cn } from "logic/utils";
import { ChevronDownIcon } from "lucide-react";

interface SelectTriggerProps {
  id: string;
  labelId: string;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  disabled: boolean;
  isOpen: boolean;
  selectedLabel: string;
  placeholder?: string;
  className?: string;
  onClick: () => void;
  iconClassName?: string;
  "aria-controls"?: string;
  "aria-activedescendant"?: string;
}

export function SelectTrigger(props: SelectTriggerProps) {
  const {
    id,
    labelId,
    triggerRef,
    disabled,
    isOpen,
    selectedLabel,
    placeholder,
    className,
    onClick,
    iconClassName,
    "aria-controls": ariaControls,
    "aria-activedescendant": ariaActiveDescendant,
  } = props;

  return (
    <button
      id={id}
      ref={triggerRef}
      className={cn(
        "flex w-full items-center justify-between px-4 py-2 text-left text-text-secondary h-11",
        "border-b border-outline-major bg-bg-primary outline-none focus:border-primary transition-colors",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
      disabled={disabled}
      onClick={onClick}
      type="button"
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      aria-labelledby={labelId}
      aria-controls={ariaControls}
      aria-activedescendant={ariaActiveDescendant}
    >
      <span
        id={labelId}
        className={cn(
          "block truncate",
          !selectedLabel && "text-sm font-normal text-outline-major",
          selectedLabel && "text-primary",
        )}
      >
        {selectedLabel || placeholder || "Please Select"}
      </span>
      <ChevronDownIcon
        className={cn(
          "size-4 text-text-secondary transition-transform",
          {
            "rotate-180": isOpen,
            hidden: disabled,
          },
          iconClassName,
        )}
      />
    </button>
  );
}
