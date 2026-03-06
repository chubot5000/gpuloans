"use client";

import { AdminApplicationsPage, AdminApplicationsPageProvider } from "logic/pages";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AdminApplicationsPageContent />
    </Suspense>
  );
}

function AdminApplicationsPageContent() {
  return (
    <AdminApplicationsPageProvider>
      <AdminApplicationsPage />
    </AdminApplicationsPageProvider>
  );
}
