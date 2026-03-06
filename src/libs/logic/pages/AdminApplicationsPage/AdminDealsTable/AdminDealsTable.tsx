import { AllDeals } from "data/fetchers";
import { format } from "date-fns";
import Link from "next/link";
import { Button, Spinner } from "ui/components";

import { AdminDealsRowTemplate } from "../AdminDealsRowTemplate";

import { TableHeader } from "./TableHeader";
import { ColumnConfig, useTableSort } from "./useTableSort";

const DEAL_COLUMNS: ColumnConfig<AllDeals>[] = [
  { key: "id", label: "#", getValue: (d) => d.id, sortType: "number", sortable: true },
  { key: "title", label: "Title", getValue: (d) => d.title },
  { key: "person_name", label: "Contact Name", getValue: (d) => d.person_name, sortType: "string", sortable: true },
  { key: "stage", label: "Stage", getValue: (d) => d.stage_id, sortType: "stageOrder", sortable: true },
  { key: "gpuType", label: "Asset Type", getValue: (d) => d.custom_fields.gpuType },
  { key: "add_time", label: "Created At", getValue: (d) => d.add_time, sortType: "date", sortable: true },
];

interface AdminDealsTableProps {
  deals?: AllDeals[];
  hideViewButton?: boolean;
  isLoading?: boolean;
}

export function AdminDealsTable(props: AdminDealsTableProps) {
  const { deals, hideViewButton, isLoading } = props;
  const { sortedItems, sortState, handleSort } = useTableSort(deals, DEAL_COLUMNS, "stage");

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-52">
        <TableHeader columns={DEAL_COLUMNS} sortState={sortState} onSort={handleSort} />
        <div className="flex flex-1 justify-center items-center">
          <Spinner className="size-4" />
        </div>
      </div>
    );
  }

  if (!sortedItems?.length) {
    return (
      <div className="flex flex-col min-h-52">
        <TableHeader columns={DEAL_COLUMNS} sortState={sortState} onSort={handleSort} />
        <div className="flex flex-1 justify-center items-center">
          <span className="text-text-secondary">No deals found</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-52">
      <TableHeader columns={DEAL_COLUMNS} sortState={sortState} onSort={handleSort} />
      {sortedItems.map((deal, index) => (
        <AdminDealsRowTemplate
          key={`${deal.id}-${index}`}
          className="first-of-type:border-t-0 min-h-11 hover:bg-bg-primary"
        >
          <span className="text-text-dark-primary">#{deal.id}</span>
          <span className="truncate text-text-dark-primary">{deal.title}</span>
          <span className="text-center text-text-dark-primary">{deal.person_name ?? "--"}</span>
          <span className="text-center text-text-dark-primary">{deal.stage_label}</span>
          <span className="text-center text-text-dark-primary">{deal.custom_fields.gpuType ?? "--"}</span>
          <span className="text-text-dark-primary">{format(deal.add_time, "dd MMM yyyy")}</span>
          {hideViewButton ? null : (
            <Button as={Link} href={`/applications/${deal.id}`} className="w-full h-6 btn-small max-w-20">
              View
            </Button>
          )}
        </AdminDealsRowTemplate>
      ))}
    </div>
  );
}
