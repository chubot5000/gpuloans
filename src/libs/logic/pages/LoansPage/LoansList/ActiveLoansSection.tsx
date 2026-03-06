import { useSearchParamsMutation } from "logic/hooks";
import { cn, denormalizeRate, formatDate, formatDuration, PolymorphProps, printPercent2FD } from "logic/utils";
import { ElementType, ReactNode } from "react";
import { AmountTooltip, Button, TableWrapper } from "ui/components";

import { Loan, LoanStatus } from "../data";
import { LoanStatusTag } from "../LoanStatusTag";
import { calcPaymentSchedule } from "../PaymentSchedule/calcPaymentSchedule";
import { useLoanTimestamps } from "../useLoanTimestamp";
import { useRepayInfo } from "../useRepayInfo";

type Props = {
  loans: Loan[];
};

export function ActiveLoansSection(props: Props) {
  const { loans } = props;

  let children: ReactNode;

  if (!loans.length) {
    children = (
      <div className="flex items-center justify-center w-full h-24">
        <span className="text-text-secondary">No active loans</span>
      </div>
    );
  } else {
    children = loans.map((loan) => <ActiveLoanRow key={loan.loanTermsHash} loan={loan} />);
  }

  return (
    <>
      <h2 className="text-3xl font-medium font-eiko text-dark-primary">My Active Loans</h2>

      <TableWrapper className="flex flex-col py-5.5 px-4 border border-outline-major bg-white overflow-x-auto">
        <ActiveLoanRowTemplate className="text-text-secondary uppercase text-sm font-normal border-b">
          <span className="uppercase text-xs text-text-dark-secondary">collateral</span>
          <span className="uppercase text-xs text-text-dark-secondary">loan status</span>
          <span className="uppercase text-xs text-text-dark-secondary">principal</span>
          <span className="uppercase text-xs text-text-dark-secondary">apr</span>
          <span className="uppercase text-xs text-text-dark-secondary">payment due</span>
          <span className="uppercase text-xs text-text-dark-secondary">payment amt</span>
          {null}
        </ActiveLoanRowTemplate>

        {children}
      </TableWrapper>
    </>
  );
}

type ActiveLoanRowProps = {
  loan: Loan;
};

function ActiveLoanRow(props: ActiveLoanRowProps) {
  const { loan } = props;

  const isPending = loan.loanState.status == LoanStatus.Uninitialized;

  const sp = useSearchParamsMutation();

  const { isRepayment } = useLoanTimestamps(loan);
  const { data: quote } = useRepayInfo(loan, isRepayment);

  const principal = isPending ? (
    <AmountTooltip amount={loan.principal} decimals={loan.erc20.decimals} />
  ) : (
    <AmountTooltip amount={loan.loanState.scaledBalance} decimals={18} />
  );

  const payment =
    loan.loanState.status == LoanStatus.Uninitialized
      ? calcPaymentSchedule(loan).repayments[0].total
      : (quote?.total ?? 0n);

  return (
    <ActiveLoanRowTemplate
      className={cn("border-b border-outline-minor h-14", { "bg-bg-primary text-text-secondary": isPending })}
    >
      <span className="line-clamp-2 text-text-primary">{loan.metadata.name ?? "-"}</span>

      <LoanStatusTag loan={loan} />

      <>{principal}</>

      <>{printPercent2FD(denormalizeRate(loan.blendedRate), { minimumFractionDigits: 1 })}</>

      {isPending ? (
        <>Every {formatDuration(loan.repaymentInterval)}</>
      ) : (
        <>{formatDate(loan.loanState.repaymentDeadline)}</>
      )}

      <AmountTooltip amount={payment} decimals={loan.erc20.decimals} />

      <Button className={cn("btn-small w-30", { "btn-tertiary": isPending })} onClick={() => sp.set("loan", loan.id)}>
        {isPending ? "Borrow" : "Pay Now"}
      </Button>
    </ActiveLoanRowTemplate>
  );
}

type ActiveLoanRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

function ActiveLoanRowTemplate<T extends ElementType>(props: ActiveLoanRowTemplateProps<T>) {
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
      <div className="w-[15%]">{children[2]}</div>
      <div className="w-[5%]">{children[3]}</div>
      <div className="w-[15%]">{children[4]}</div>
      <div className="w-[15%]">{children[5]}</div>
      <div className="w-[15%]">{children[6]}</div>
    </Component>
  );
}
