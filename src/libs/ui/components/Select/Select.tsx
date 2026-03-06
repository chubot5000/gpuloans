"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useIsMounted } from "logic/hooks";
import { cn } from "logic/utils";
import { useCallback, useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SelectDropdownContent } from "./SelectDropdownContent";
import { type SelectOption } from "./SelectOptionItem";
import { SelectSearch } from "./SelectSearch";
import { SelectTrigger } from "./SelectTrigger";

type DropdownDirection = "up" | "down";

interface DropdownPosition {
  left: number;
  width: number;
  top: number;
  bottom: number;
}

export interface SelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  options: (string | SelectOption)[];
  placeholder?: string;
  disabled?: boolean;
  searchable?: boolean;
  addable?: boolean;
  onAddNew?: (searchTerm: string) => void;
  isAddingNew?: boolean;
  allowCustom?: boolean;
  className?: string;
  dropdownClassName?: string;
  triggerClassName?: string;
  iconClassName?: string;
}

function useClickOutside(refs: React.RefObject<HTMLElement | null>[], callback: () => void, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutside = refs.every((ref) => ref.current && !ref.current.contains(target));

      if (isOutside) callback();
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [refs, callback, enabled]);
}

function useDropdownPosition(
  isOpen: boolean,
  triggerRef: React.RefObject<HTMLButtonElement | null>,
  contentRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
) {
  const [direction, setDirection] = useState<DropdownDirection>("down");
  const [position, setPosition] = useState<DropdownPosition>({
    left: 0,
    width: 0,
    top: 0,
    bottom: 0,
  });

  useEffect(() => {
    if (!isOpen || !triggerRef.current) return;

    const updatePosition = () => {
      const rect = triggerRef.current!.getBoundingClientRect();
      const dropdownHeight = 300;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;

      const newDirection: DropdownDirection = spaceBelow < dropdownHeight && spaceAbove > spaceBelow ? "up" : "down";

      setDirection(newDirection);
      setPosition({
        left: rect.left,
        width: rect.width,
        top: rect.bottom + 8,
        bottom: window.innerHeight - rect.top + 8,
      });
    };

    updatePosition();

    const handleScroll = (e: Event) => {
      if (contentRef.current?.contains(e.target as Node)) return;
      onClose();
    };

    const handleResize = () => onClose();

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen, triggerRef, contentRef, onClose]);

  return { direction, position };
}

function useNormalizedOptions(rawOptions: (string | SelectOption)[]): SelectOption[] {
  return useMemo(
    () => rawOptions.map((option) => (typeof option === "string" ? { value: option, label: option } : option)),
    [rawOptions],
  );
}

/**
 * A highly customizable Select component with search, addable, and custom value features.
 *
 * @param options - The options to display in the select.
 * @param value - The value of the selected option.
 * @param onChange - The function to call when the value changes.
 * @param placeholder - The placeholder text to display when no option is selected.
 * @param disabled - Whether the select is disabled.
 * @param searchable - Whether to show a search input.
 * @param addable - Whether to allow adding new options.
 * @param onAddNew - The function to call when a new option is added.
 * @param isAddingNew - Whether the add new operation is currently in progress.
 * @param allowCustom - Whether to allow custom values.
 * @param className - The class name to apply to the root element.
 * @param dropdownClassName - The class name to apply to the dropdown content.
 * @param triggerClassName - The class name to apply to the trigger button.
 * @param iconClassName - The class name to apply to the icon.
 */
export function Select(props: SelectProps) {
  const {
    id: providedId,
    onChange,
    value,
    options: rawOptions,
    placeholder,
    disabled = false,
    searchable = false,
    addable = false,
    onAddNew,
    isAddingNew = false,
    allowCustom = false,
    className,
    dropdownClassName,
    triggerClassName,
    iconClassName,
  } = props;

  const generatedId = useId();
  const id = providedId || generatedId;

  // State
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [internalValue, setInternalValue] = useState(value);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Derived state
  const options = useNormalizedOptions(rawOptions);
  const isMounted = useIsMounted();

  // Sync internal value with prop
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Close dropdown and reset search
  const closeDropdown = useCallback(() => {
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    // Return focus to trigger
    triggerRef.current?.focus();
  }, []);

  // Custom hooks
  useClickOutside([dropdownRef, contentRef], closeDropdown, isOpen);

  const { direction, position } = useDropdownPosition(isOpen, triggerRef, contentRef, closeDropdown);

  // Auto-focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable) {
      setTimeout(() => searchInputRef.current?.focus(), 0);
    }
  }, [isOpen, searchable]);

  // Computed values (must be before handlers that use them)
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchTerm) return options;
    const term = searchTerm.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(term));
  }, [options, searchable, searchTerm]);

  const showCustomOption =
    allowCustom &&
    !!searchTerm.trim() &&
    !filteredOptions.some((option) => option.value.toLowerCase() === searchTerm.trim().toLowerCase());

  const showAddOption = addable && !!searchTerm.trim() && filteredOptions.length === 0;

  // Items that can be keyboard-navigated
  const navigableItemsCount = filteredOptions.length + (showCustomOption ? 1 : 0) + (showAddOption ? 1 : 0);

  const selectedOptionLabel = useMemo(() => {
    const foundOption = options.find((opt) => opt.value === internalValue);
    return foundOption ? foundOption.label : internalValue;
  }, [options, internalValue]);

  // Handlers
  const toggleDropdown = useCallback(() => {
    if (!disabled) {
      setIsOpen((prev) => !prev);
    }
  }, [disabled]);

  const handleOptionSelect = useCallback(
    (optionValue: string) => {
      onChange(optionValue);
      setInternalValue(optionValue);
      closeDropdown();
    },
    [onChange, closeDropdown],
  );

  const handleCustomValueConfirm = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (trimmed && allowCustom) {
      onChange(trimmed);
      setInternalValue(trimmed);
      closeDropdown();
    }
  }, [searchTerm, allowCustom, onChange, closeDropdown]);

  const handleAddOption = useCallback(() => {
    const trimmed = searchTerm.trim();
    if (addable && onAddNew && !isAddingNew && trimmed) {
      onAddNew(trimmed);
      closeDropdown();
    }
  }, [addable, onAddNew, isAddingNew, searchTerm, closeDropdown]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (disabled) return;

      if (!isOpen) {
        if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          setIsOpen(true);
        }
        return;
      }

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          if (navigableItemsCount > 0) {
            setHighlightedIndex((prev) => (prev + 1) % navigableItemsCount);
          }
          break;
        case "ArrowUp":
          e.preventDefault();
          if (navigableItemsCount > 0) {
            setHighlightedIndex((prev) => (prev - 1 + navigableItemsCount) % navigableItemsCount);
          }
          break;
        case "Enter":
          e.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
            handleOptionSelect(filteredOptions[highlightedIndex].value);
          } else if (highlightedIndex === filteredOptions.length) {
            if (showCustomOption) handleCustomValueConfirm();
            else if (showAddOption) handleAddOption();
          } else if (filteredOptions.length === 1) {
            handleOptionSelect(filteredOptions[0].value);
          } else if (showCustomOption) {
            handleCustomValueConfirm();
          } else if (showAddOption) {
            handleAddOption();
          }
          break;
        case "Escape":
          e.preventDefault();
          closeDropdown();
          break;
        case "Tab":
          closeDropdown();
          break;
      }
    },
    [
      disabled,
      isOpen,
      navigableItemsCount,
      highlightedIndex,
      filteredOptions,
      showCustomOption,
      showAddOption,
      handleOptionSelect,
      handleCustomValueConfirm,
      handleAddOption,
      closeDropdown,
    ],
  );

  const activeDescendant =
    highlightedIndex >= 0
      ? highlightedIndex < filteredOptions.length
        ? `${id}-option-${highlightedIndex}`
        : `${id}-custom-option`
      : undefined;

  return (
    <div className={cn("relative", className)} ref={dropdownRef} onKeyDown={handleKeyDown}>
      <SelectTrigger
        id={`${id}-trigger`}
        labelId={`${id}-label`}
        triggerRef={triggerRef}
        disabled={disabled}
        isOpen={isOpen}
        selectedLabel={selectedOptionLabel}
        placeholder={placeholder}
        className={triggerClassName}
        onClick={toggleDropdown}
        iconClassName={iconClassName}
        aria-controls={`${id}-listbox`}
        aria-activedescendant={activeDescendant}
      />

      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={contentRef}
                style={{
                  position: "fixed",
                  left: position.left,
                  width: position.width,
                  top: direction === "down" ? position.top : "auto",
                  bottom: direction === "up" ? position.bottom : "auto",
                  zIndex: 9999,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: direction === "down" ? -10 : 10 }}
                className={cn("border border-outline-major bg-bg-page shadow-md", dropdownClassName)}
                initial={{ opacity: 0, y: direction === "down" ? -10 : 10 }}
                transition={{ duration: 0.2 }}
                role="listbox"
                id={`${id}-listbox`}
                aria-labelledby={`${id}-label`}
                aria-activedescendant={activeDescendant}
                tabIndex={-1}
              >
                {searchable && (
                  <SelectSearch
                    searchInputRef={searchInputRef}
                    searchTerm={searchTerm}
                    onChange={setSearchTerm}
                    onKeyDown={handleKeyDown}
                    aria-activedescendant={activeDescendant}
                    aria-controls={`${id}-listbox`}
                  />
                )}
                <div className="overflow-y-auto max-h-80 custom-scrollbar">
                  <SelectDropdownContent
                    id={id}
                    filteredOptions={filteredOptions}
                    selectedValue={internalValue}
                    highlightedIndex={highlightedIndex}
                    searchTerm={searchTerm}
                    showCustomOption={showCustomOption}
                    showAddOption={showAddOption}
                    isAddingNew={isAddingNew}
                    onSelectOption={handleOptionSelect}
                    onCustomValueConfirm={handleCustomValueConfirm}
                    onAddOption={handleAddOption}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </div>
  );
}
