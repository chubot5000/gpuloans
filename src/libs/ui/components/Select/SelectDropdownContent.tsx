import { cn } from "logic/utils";

import { AddNewButton } from "./AddNewButton";
import { CreateCustomButton } from "./CreateCustomButton";
import { SelectOptionItem, type SelectOption } from "./SelectOptionItem";

interface SelectDropdownContentProps {
  id: string;
  filteredOptions: SelectOption[];
  selectedValue: string;
  highlightedIndex: number;
  searchTerm: string;
  showCustomOption: boolean;
  showAddOption: boolean;
  isAddingNew: boolean;
  onSelectOption: (value: string) => void;
  onCustomValueConfirm: () => void;
  onAddOption: () => void;
}

export function SelectDropdownContent(props: SelectDropdownContentProps) {
  const {
    id,
    filteredOptions,
    selectedValue,
    highlightedIndex,
    searchTerm,
    showCustomOption,
    showAddOption,
    isAddingNew,
    onSelectOption,
    onCustomValueConfirm,
    onAddOption,
  } = props;

  const trimmedSearchTerm = searchTerm.trim();

  const renderOptions = () => {
    return filteredOptions.map((option, index) => (
      <SelectOptionItem
        id={`${id}-option-${index}`}
        key={option.value}
        option={option}
        isSelected={option.value === selectedValue}
        isHighlighted={index === highlightedIndex}
        onSelect={onSelectOption}
      />
    ));
  };

  if (filteredOptions.length > 0) {
    return (
      <>
        {renderOptions()}
        {showCustomOption && (
          <div
            id={`${id}-custom-option`}
            role="option"
            aria-selected={highlightedIndex === filteredOptions.length}
            className={cn(highlightedIndex === filteredOptions.length && "bg-bg-secondary")}
          >
            <CreateCustomButton searchTerm={trimmedSearchTerm} onClick={onCustomValueConfirm} fullWidth />
          </div>
        )}
      </>
    );
  }

  return (
    <div className="px-4 py-3 text-sm text-center text-outline-major">
      {showCustomOption ? (
        <div
          id={`${id}-custom-option`}
          role="option"
          aria-selected={highlightedIndex === 0}
          className={cn(highlightedIndex === 0 && "bg-bg-secondary")}
        >
          <CreateCustomButton searchTerm={trimmedSearchTerm} onClick={onCustomValueConfirm} fullWidth />
        </div>
      ) : showAddOption ? (
        <div
          id={`${id}-custom-option`}
          role="option"
          aria-selected={highlightedIndex === 0}
          className={cn(highlightedIndex === 0 && "bg-bg-secondary", "rounded-md p-1")}
        >
          <AddNewButton searchTerm={trimmedSearchTerm} isLoading={isAddingNew} onClick={onAddOption} />
        </div>
      ) : (
        "No results found"
      )}
    </div>
  );
}
