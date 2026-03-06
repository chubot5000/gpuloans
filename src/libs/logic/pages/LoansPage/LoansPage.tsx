"use client";

import { useWeb3, WelcomeBackLogin } from "logic/components";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Msg } from "ui/components";

import { LoanDetails } from "./LoanDetails";
import { LoansList } from "./LoansList";
import { LoansPageProvider } from "./LoansPageProvider";
import { useBorrowerLoans } from "./useBorrowerLoans";

export function LoansPage() {
  return (
    <Suspense>
      <LoansPageProvider>
        <LoansPageContent />
      </LoansPageProvider>
    </Suspense>
  );
}

function LoansPageContent() {
  const {
    account: { ready, address },
  } = useWeb3();

  const selectedLoanId = useSearchParams().get("loan");

  const { data: loans, error: loansError } = useBorrowerLoans();

  if (!ready) return <Msg className="m-auto">Loading...</Msg>;

  if (!address)
    return (
      <div className="h-main -mb-24 mt-16 flex flex-col items-center justify-start">
        <WelcomeBackLogin />
      </div>
    );

  if (!loans) {
    if (loansError) return <Msg className="m-auto text-red-400">Something went wrong</Msg>;
    return <Msg className="m-auto">Loading...</Msg>;
  }

  return selectedLoanId ? <LoanDetails /> : <LoansList loans={loans} />;
}
