import { useSearchParamsMutation } from "logic/hooks";
import { ChevronLeftIcon } from "lucide-react";
import { ReactNode } from "react";

import { LoanStatus } from "../data/types";
import { useLoansPage } from "../LoansPageProvider";
import { useBorrowerLoans } from "../useBorrowerLoans";

import { LoanBorrow } from "./LoanBorrow";
import { LoanPayment } from "./LoanPayment";
import { BorrowerBalance } from "./LoanPayment/BorrowerBalance";
import { BridgeModal } from "./LoanPayment/BridgeModal";
import { WithdrawModal } from "./LoanPayment/WithdrawModal";

export function LoanDetails() {
  const sp = useSearchParamsMutation();
  const selectedLoanId = sp.get("loan");

  const { data: loans } = useBorrowerLoans();
  const { isWithdrawModalOpen, setIsWithdrawModalOpen, isBridgeModalOpen, setIsBridgeModalOpen } = useLoansPage();
  const loan = loans?.find((loan) => loan.id == selectedLoanId);

  let children: ReactNode;

  if (!loan) {
    children = (
      <div className="flex items-center justify-center h-[80vh]">
        <span>Loan not found</span>
      </div>
    );
  } else {
    children = loan.loanState.status == LoanStatus.Active ? <LoanPayment loan={loan} /> : <LoanBorrow loan={loan} />;
  }

  return (
    <>
      <div className="flex items-center text-primary gap-2 flex-wrap">
        <button className="flex items-center self-stretch w-8" onClick={() => sp.set("loan", undefined)} type="button">
          <ChevronLeftIcon className="size-6" />
        </button>

        <h1 className="font-eiko text-3xl font-medium capitalize">{loan?.metadata.name ?? "Loan Details"}</h1>

        <div className="grow" />
        {loan ? (
          <>
            <BorrowerBalance loan={loan} />
            {/* -- Modals -- */}
            <WithdrawModal
              token={loan.erc20}
              chainId={loan.chain}
              isOpen={isWithdrawModalOpen}
              onClose={() => setIsWithdrawModalOpen(false)}
            />
            <BridgeModal
              token={loan.erc20}
              chainId={loan.chain}
              isOpen={isBridgeModalOpen}
              onClose={() => setIsBridgeModalOpen(false)}
            />
          </>
        ) : null}
      </div>

      {children}
    </>
  );
}
