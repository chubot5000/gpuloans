"use client";

import { ContactPage } from "logic/pages";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <div className="hidden md:block absolute top-0 left-0 w-1/2 h-full bg-brown-900 -z-[1]" />
      <div className="flex flex-1 justify-center items-center">
        <ContactPage />
      </div>
      <div className="hidden md:block absolute bottom-0 right-0 w-1/2 h-full bg-white -z-[1]" />
    </Suspense>
  );
}
