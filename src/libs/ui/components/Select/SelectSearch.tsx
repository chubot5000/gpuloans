import { cn } from "logic/utils";
import { Input } from "ui/components";

interface SelectSearchProps {
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  searchTerm: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  "aria-activedescendant"?: string;
  "aria-controls"?: string;
}

export function SelectSearch(props: SelectSearchProps) {
  const {
    searchInputRef,
    searchTerm,
    onChange,
    onKeyDown,
    "aria-activedescendant": ariaActiveDescendant,
    "aria-controls": ariaControls,
  } = props;

  return (
    <div className="px-3 py-2 border-b border-outline-major">
      <Input
        inputRef={searchInputRef}
        className={cn(
          "w-full border-outline-major bg-transparent text-sm text-primary outline-none",
          "placeholder:text-outline-major focus:ring-0",
        )}
        inputClassName="!bg-transparent text-sm font-normal placeholder:opacity-60 h-11"
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Type to search..."
        type="text"
        value={searchTerm}
        aria-label="Search options"
        aria-autocomplete="list"
        aria-controls={ariaControls}
        aria-activedescendant={ariaActiveDescendant}
      />
    </div>
  );
}
