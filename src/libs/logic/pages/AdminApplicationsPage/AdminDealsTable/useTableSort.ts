import { STAGES_ORDER } from "data/clients/pipedrive/constants.generated";
import { useCallback, useMemo, useState } from "react";

// ============================================================================
// Types
// ============================================================================

export type SortDirection = "asc" | "desc";

export interface ColumnConfig<T> {
  key: string;
  label: string;
  getValue: (item: T) => string | number | null | undefined;
  sortType?: "string" | "number" | "date" | "stageOrder";
  sortable?: boolean;
}

export interface SortState<T> {
  column: ColumnConfig<T>;
  direction: SortDirection;
}

// ============================================================================
// Hook
// ============================================================================

export function useTableSort<T>(
  items: T[] | undefined,
  columns: ColumnConfig<T>[],
  defaultColumn: string,
) {
  const defaultCol = columns.find((c) => c.key === defaultColumn) ?? columns[0];

  const [sortState, setSortState] = useState<SortState<T>>({
    column: defaultCol,
    direction: "desc",
  });

  const handleSort = useCallback((column: ColumnConfig<T>) => {
    setSortState((prev) => ({
      column,
      direction: prev.column.key === column.key && prev.direction === "asc" ? "desc" : "asc",
    }));
  }, []);

  const sortedItems = useMemo(() => {
    if (!items) return undefined;

    const { column, direction } = sortState;

    return [...items].sort((a, b) => {
      const aRaw = column.getValue(a);
      const bRaw = column.getValue(b);

      const normalize = (val: typeof aRaw): string | number => {
        if (val === null || val === undefined) return "";

        switch (column.sortType) {
          case "date":
            return new Date(val as string | number).getTime();
          case "number":
            return Number(val);
          case "stageOrder": {
            const index = STAGES_ORDER.indexOf(val as (typeof STAGES_ORDER)[number]);
            return index === -1 ? Infinity : index;
          }
          default:
            return String(val).toLowerCase();
        }
      };

      const aVal = normalize(aRaw);
      const bVal = normalize(bRaw);

      // Push empty values to the end regardless of direction
      if (aVal === "" && bVal !== "") return 1;
      if (bVal === "" && aVal !== "") return -1;

      if (aVal < bVal) return direction === "asc" ? -1 : 1;
      if (aVal > bVal) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [items, sortState]);

  return { sortedItems, sortState, handleSort };
}
