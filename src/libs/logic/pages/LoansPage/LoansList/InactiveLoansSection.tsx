import { useSearchParamsMutation } from "logic/hooks";
import { cn, PolymorphProps } from "logic/utils";
import { ElementType, ReactNode } from "react";
import { Button, TableWrapper } from "ui/components";

import { Loan } from "../data";
import { LoanStatusTag, UILoanStatus, useUILoanStatus } from "../LoanStatusTag";

type Props = {
  loans: Loan[];
};

export function InactiveLoansSection(props: Props) {
  const { loans } = props;

  let children: ReactNode;

  if (!loans.length) {
    children = (
      <div className="flex items-center justify-center w-full h-24">
        <span className="text-text-secondary">No inactive loans</span>
      </div>
    );
  } else {
    children = loans.map((loan) => <InactiveLoanRow key={loan.loanTermsHash} loan={loan} />);
  }

  return (
    <>
      <h2 className="text-3xl font-medium font-eiko text-dark-primary">My Inactive Loans</h2>

      <TableWrapper className="flex flex-col py-5.5 px-4 border border-outline-major bg-white overflow-x-auto">
        <InactiveLoanRowTemplate className="text-text-secondary uppercase text-sm font-normal border-b">
          <span className="uppercase text-xs text-text-dark-secondary">collateral</span>
          <span className="uppercase text-xs text-text-dark-secondary">loan status</span>
          {null}
          {null}
        </InactiveLoanRowTemplate>

        {children}
      </TableWrapper>
    </>
  );
}

type InactiveLoanRowProps = {
  loan: Loan;
};

function InactiveLoanRow(props: InactiveLoanRowProps) {
  const { loan } = props;

  const uiLoanStatus = useUILoanStatus(loan);

  const sp = useSearchParamsMutation();

  let description: ReactNode = "-";

  if (uiLoanStatus == UILoanStatus.Closed) {
    description = <>Loan was repaid</>;
  } else if (uiLoanStatus == UILoanStatus.AtAuction) {
    description = <>Borrower defaulted and collateral is currently at auction</>;
  } else if (uiLoanStatus == UILoanStatus.Auctioned) {
    description = <>Auction completed and collateral was claimed</>;
  }

  description = <p className="text-text-secondary text-sm text-start w-full">{description}</p>;

  return (
    <InactiveLoanRowTemplate className="border-b border-outline-minor h-14">
      <span className="line-clamp-2">{loan.metadata.name ?? "-"}</span>

      <LoanStatusTag loan={loan} className="w-24" />

      {description}

      <Button
        className="btn-small w-30 btn-secondary whitespace-nowrap"
        // disabled
        onClick={() => sp.set("loan", loan.id)}
      >
        View Details
      </Button>
    </InactiveLoanRowTemplate>
  );
}

type InactiveLoanRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

function InactiveLoanRowTemplate<T extends ElementType>(props: InactiveLoanRowTemplateProps<T>) {
  const { as: Component = "div", className, children, ...rest } = props;

  return (
    <Component
      className={cn(
        "flex items-center w-full [&>div]:flex [&>div]:justify-center [&>div]:shrink-0 py-2 px-4 min-w-[60rem]",
        className,
      )}
      {...rest}
    >
      <div className="!justify-start w-[20%]">{children[0]}</div>
      <div className="w-[15%]">{children[1]}</div>
      <div className="w-[50%]">{children[2]}</div>
      <div className="w-[15%]">{children[3]}</div>
    </Component>
  );
}
