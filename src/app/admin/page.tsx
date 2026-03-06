"use client";

import { AdminPage } from "logic/pages";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <AdminPage />
    </Suspense>
  );
}
