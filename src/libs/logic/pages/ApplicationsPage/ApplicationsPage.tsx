"use client";

import { getAccountDeals } from "data/fetchers";
import { useConnectedEmail, useNewLeadCreation } from "logic/hooks";
import { PlusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Msg, TableWrapper } from "ui/components";

import { useApplications } from "./ApplicationsPageProvider";
import { ApplicationsTable } from "./ApplicationsTable";

export function ApplicationsPage() {
  const router = useRouter();
  const email = useConnectedEmail();
  const { activeDeals, isLoading } = useApplications();
  const { mutateAsync, isPending } = useNewLeadCreation();
  const [isFetching, setIsFetching] = useState(false);

  const isCreating = isPending || isFetching;

  const handleCreateApplication = async () => {
    if (!email) return;

    setIsFetching(true);
    try {
      const accountData = await getAccountDeals({ email });

      if (!accountData) throw new Error("Account not found in Pipedrive");

      const { personName, deals } = accountData;
      const companyName = deals[0]?.title;

      if (!companyName) throw new Error("No existing deals found to get company info");

      const result = await mutateAsync({
        fullName: personName,
        workEmail: email,
        companyName,
      });

      if (result.dealId) router.push(`/applications/${result.dealId}`);
    } finally {
      setIsFetching(false);
    }
  };

  if (isLoading) return <Msg className="m-auto">Loading...</Msg>;

  if (!activeDeals) return <Msg className="m-auto">No applications found</Msg>;

  return (
    <>
      <div className="flex flex-col justify-center gap-4 md:flex-row">
        <h1 className="order-2 text-3xl font-medium font-eiko text-dark-primary md:order-1">My Applications</h1>
        <Button
          onClick={handleCreateApplication}
          disabled={isCreating || !email}
          isLoading={isCreating}
          className="flex items-center gap-2 w-44 order-1 md:order-2 ml-auto"
        >
          <PlusIcon className="size-4" />
          New Application
        </Button>
      </div>

      <TableWrapper className="flex flex-col py-5.5 px-4 gap-8.5 border border-outline-major bg-white">
        <ApplicationsTable deals={activeDeals} />
      </TableWrapper>
    </>
  );
}
