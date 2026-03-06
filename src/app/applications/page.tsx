"use client";

import { ApplicationsLogin } from "logic/components";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <div className="flex flex-col justify-start items-center mt-16 -mb-16 h-main">
        <ApplicationsLogin className="items-center" />
      </div>
    </Suspense>
  );
}
