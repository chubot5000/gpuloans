import { AccountDeal } from "data/fetchers/pipedrive";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "ui/components";

import { ApplicationsRowTemplate } from "./ApplicationsRowTemplate";
import { StatusBadge } from "./StatusBadge";

interface ApplicationsTableProps {
  deals?: AccountDeal[];
  hideViewButton?: boolean;
}

export function ApplicationsTable(props: ApplicationsTableProps) {
  const { deals, hideViewButton } = props;

  let gridContent;

  if (!deals || deals.length === 0) {
    gridContent = (
      <div className="flex justify-center items-center p-4 min-h-52">
        <span className="text-text-secondary">No applications found</span>
      </div>
    );
  } else {
    gridContent = (
      <div className="min-h-52">
        <ApplicationsTableHeader />
        {deals.map((deal, index) => (
          <ApplicationsRowTemplate
            key={`${deal.id}-${index}`}
            className="first-of-type:border-t-0 min-h-11 hover:bg-bg-primary"
          >
            <span className="text-text-dark-primary">#{deal.id}</span>
            <span className="text-text-dark-primary">{deal.gpuType ?? "--"}</span>
            <StatusBadge status={deal.status} />
            <span className="text-text-dark-primary">{format(deal.addTime, "dd MMM yyyy")}</span>
            {!hideViewButton ? (
              <Button as={Link} href={`/applications/${deal.id}`} className="w-full h-6 btn-small max-w-20">
                View
              </Button>
            ) : null}
          </ApplicationsRowTemplate>
        ))}
      </div>
    );
  }

  return gridContent;
}

export function ApplicationsTableHeader() {
  return (
    <ApplicationsRowTemplate>
      <span className="text-xs uppercase text-text-dark-secondary">Application#</span>
      <span className="text-xs uppercase text-text-dark-secondary">Asset Type</span>
      <span className="text-xs uppercase text-text-dark-secondary">Status</span>
      <span className="text-xs uppercase text-text-dark-secondary">Time</span>
      {null}
    </ApplicationsRowTemplate>
  );
}
