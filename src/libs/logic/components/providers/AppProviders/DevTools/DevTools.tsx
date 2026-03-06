import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Suspense } from "react";

export function DevTools() {
  return (
    <>
      {process.env.NODE_ENV === "development" && (
        <Suspense fallback={null}>
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </Suspense>
      )}
    </>
  );
}
