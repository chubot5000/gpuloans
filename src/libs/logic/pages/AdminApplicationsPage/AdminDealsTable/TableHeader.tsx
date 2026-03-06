import { AllDeals } from "data/fetchers";
import { cn } from "logic/utils";
import { ChevronDownIcon } from "lucide-react";

import { AdminDealsRowTemplate } from "../AdminDealsRowTemplate";

import { ColumnConfig, SortState } from "./useTableSort";

interface TableHeaderProps {
  columns: ColumnConfig<AllDeals>[];
  sortState: SortState<AllDeals>;
  onSort: (column: ColumnConfig<AllDeals>) => void;
}

export function TableHeader({ columns, sortState, onSort }: TableHeaderProps) {
  const [col0, col1, col2, col3, col4, col5] = columns;

  return (
    <AdminDealsRowTemplate>
      <ColumnHeader column={col0} sortState={sortState} onSort={onSort} />
      <ColumnHeader column={col1} sortState={sortState} onSort={onSort} />
      <ColumnHeader column={col2} sortState={sortState} onSort={onSort} />
      <ColumnHeader column={col3} sortState={sortState} onSort={onSort} />
      <ColumnHeader column={col4} sortState={sortState} onSort={onSort} />
      <ColumnHeader column={col5} sortState={sortState} onSort={onSort} />
      {null}
    </AdminDealsRowTemplate>
  );
}

interface ColumnHeaderProps {
  column: ColumnConfig<AllDeals>;
  sortState: SortState<AllDeals>;
  onSort: (column: ColumnConfig<AllDeals>) => void;
}

function ColumnHeader({ column, sortState, onSort }: ColumnHeaderProps) {
  if (!column.sortable) {
    return <span className="text-xs uppercase text-text-dark-secondary">{column.label}</span>;
  }

  const isActive = sortState.column.key === column.key;
  const isAscending = sortState.direction === "asc";

  function getAriaSort(): "ascending" | "descending" | undefined {
    if (!isActive) return undefined;
    return isAscending ? "ascending" : "descending";
  }

  function getChevronClass(): string {
    if (!isActive) return "opacity-0";
    return isAscending ? "rotate-180" : "";
  }

  return (
    <button
      type="button"
      onClick={() => onSort(column)}
      aria-sort={getAriaSort()}
      className={cn(
        "flex items-center gap-1 text-xs uppercase text-text-dark-secondary",
        "hover:text-text-dark-primary cursor-pointer transition-colors",
        isActive && "text-text-dark-primary",
      )}
    >
      {column.label}
      <ChevronDownIcon aria-hidden="true" className={cn("size-3 transition-transform", getChevronClass())} />
    </button>
  );
}
