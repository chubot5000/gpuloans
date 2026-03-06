"use client";

import { TabGroup, TabPanel, TabPanels } from "@headlessui/react";
import { STAGES, STAGES_LABELS } from "data/clients/pipedrive/constants.generated";
import { cn } from "logic/utils";
import { SearchIcon } from "lucide-react";
import { Input, PageWrapper, Select, TableWrapper } from "ui/components";

import { useAdminApplicationsPage } from "./AdminApplicationsPageProvider";
import { AdminDealsTable } from "./AdminDealsTable";
import { AdminNavTabs } from "./NavTabs";

const STAGES_TO_FILTER = [
  STAGES.DEAD_DEPRIORITIZED,
  STAGES.MONITORING,
  STAGES.NEW_LEAD,
  STAGES.INTRO_CALL_SCHEDULED,
  STAGES.INTRO_CALL_HELD,
  STAGES.TERM_SHEET_SENT,
  STAGES.TERM_SHEET_SIGNED,
  STAGES.PO_DEPOSIT_PLACED,
  STAGES.INSTALLED,
  STAGES.FUNDED,
];

const STAGE_FILTER_OPTIONS = [
  { value: "", label: "All Stages" },
  ...STAGES_TO_FILTER.map((stage) => ({
    value: stage.toString(),
    label: STAGES_LABELS[stage],
  })),
];

export function AdminApplicationsPage() {
  return <AdminApplicationsPage_ />;
}

function AdminApplicationsPage_() {
  const { testDeals, liveDeals, tab, setTab, searchTerm, setSearchTerm, stageFilter, setStageFilter, isLoading } =
    useAdminApplicationsPage();

  const stageFilterValue = stageFilter !== undefined ? stageFilter.toString() : "";

  const handleStageFilterChange = (value: string) => {
    if (value === "") setStageFilter(undefined);
    else setStageFilter(parseInt(value, 10) as STAGES);
  };

  return (
    <PageWrapper>
      <TabGroup className="flex flex-col gap-7 size-full max-w-360" onChange={setTab} selectedIndex={tab}>
        <AdminNavTabs className="mx-auto" />

        <TableWrapper className="flex flex-col py-5.5 px-8 gap-8.5 border border-outline-major bg-white flex-1">
          <div className="flex flex-col gap-4 justify-end items-center md:flex-row">
            <Select
              value={stageFilterValue}
              onChange={handleStageFilterChange}
              options={STAGE_FILTER_OPTIONS}
              placeholder="Filter by Stage"
              className="order-2 w-full md:order-1 md:w-64"
              triggerClassName="border border-outline-major bg-transparent text-sm h-10"
            />
            <Input
              inputClassName="px-0"
              placeholder="Search by Application ID"
              value={searchTerm}
              onChange={setSearchTerm}
              leading={<SearchIcon className="mx-2 w-4 h-4 text-outline-major" />}
              className={cn(
                "w-full border-outline-major bg-transparent text-sm text-primary h-10",
                "placeholder:text-outline-major md:w-64 order-1 md:order-2 outline-none",
              )}
            />
          </div>

          <TabPanels>
            <TabPanel>
              <AdminDealsTable deals={liveDeals} isLoading={isLoading} />
            </TabPanel>
            <TabPanel>
              <AdminDealsTable deals={testDeals} isLoading={isLoading} />
            </TabPanel>
          </TabPanels>
        </TableWrapper>
      </TabGroup>
    </PageWrapper>
  );
}
