"use client";

import { usePrivy } from "@privy-io/react-auth";
import { ApplicationsLogin } from "logic/components";
import { ApplicationsPage, ApplicationsPageProvider } from "logic/pages";
import { Suspense } from "react";
import { Msg } from "ui/components";

export default function Page() {
  return (
    <Suspense>
      <ApplicationsPageContent />
    </Suspense>
  );
}

function ApplicationsPageContent() {
  const { ready, user } = usePrivy();

  if (!ready) return <Msg className="m-auto">Loading...</Msg>;

  if (!user || !user.email)
    return (
      <div className="flex flex-col justify-start items-center mt-16 -mb-16 h-main">
        <ApplicationsLogin className="items-center" />
      </div>
    );

  return (
    <ApplicationsPageProvider>
      <ApplicationsPage />
    </ApplicationsPageProvider>
  );
}
