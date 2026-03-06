import { PaymentHistoryEntry } from "data/loanRouterSubgraph";
import { cn, formatDate, PolymorphProps } from "logic/utils";
import { ElementType, ReactNode } from "react";
import { AmountTooltip, AmountTooltipProps } from "ui/components";

import { Loan } from "../data";
import { PaymentSchedule } from "../PaymentSchedule";
import { StatusTag } from "../StatusTag";
import { usePaymentHistory } from "../usePaymentHistory";

type Props = {
  loan: Loan;
  className?: string;
};

export function PaymentHistory(props: Props) {
  const { loan, className } = props;

  const { data, error } = usePaymentHistory(loan);

  let children: ReactNode;

  if (!data) {
    if (error) {
      children = (
        <div className="flex items-center justify-center w-full h-24">
          <span className="text-red-300 my-auto">Something went wrong</span>
        </div>
      );
    } else {
      children = (
        <div className="flex items-center justify-center w-full h-24">
          <span className="text-text-secondary my-auto">Loading...</span>
        </div>
      );
    }
  } else {
    if (!data.length) {
      children = (
        <div className="flex items-center justify-center w-full h-24">
          <span className="text-text-secondary my-auto">No payments yet</span>
        </div>
      );
    } else {
      children = data.map((payment) => <PaymentRow key={payment.timestamp} payment={payment} loan={loan} />);
    }
  }

  return (
    <div className={cn("px-8 py-5 border border-outline-major", className)}>
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-eiko font-medium">Payment History</h2>
        <PaymentSchedule loan={loan} />
      </div>

      <div className="flex flex-col overflow-x-auto divide-y">
        <PaymentRowTemplate className="text-text-secondary uppercase text-sm font-normal border-t border-b">
          <>date</>
          <>principal</>
          <>interest</>
          <>prepayment</>
          <>total</>
        </PaymentRowTemplate>

        {children}
      </div>
    </div>
  );
}

type PaymentProps = {
  loan: Loan;
  payment: PaymentHistoryEntry;
};

function PaymentRow(props: PaymentProps) {
  const { loan, payment } = props;

  return (
    <PaymentRowTemplate className="h-12">
      <>
        <span>{formatDate(payment.timestamp)} </span>
        {payment.isGracePeriod ? (
          <StatusTag variant="red" className="inline text-xs ml-2">
            Late
          </StatusTag>
        ) : null}
      </>
      <AmountTooltipNullable amount={payment.principal} decimals={loan.erc20.decimals} />
      <AmountTooltipNullable amount={payment.interest} decimals={loan.erc20.decimals} />
      <AmountTooltipNullable amount={payment.prepayment} decimals={loan.erc20.decimals} />
      <AmountTooltipNullable
        amount={payment.principal + payment.interest + payment.prepayment}
        decimals={loan.erc20.decimals}
      />
    </PaymentRowTemplate>
  );
}

type PaymentRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

function PaymentRowTemplate<T extends ElementType>(props: PaymentRowTemplateProps<T>) {
  const { as: Component = "div", className, children, ...rest } = props;

  return (
    <Component
      className={cn("flex items-center [&>div]:flex [&>div]:justify-center py-2 px-4 min-w-[40rem] gap-2", className)}
      {...rest}
    >
      <div className="!justify-start w-[30%]">{children[0]}</div>
      <div className="w-[17.5%]">{children[1]}</div>
      <div className="w-[17.5%]">{children[2]}</div>
      <div className="w-[17.5%]">{children[3]}</div>
      <div className="w-[17.5%]">{children[4]}</div>
    </Component>
  );
}

function AmountTooltipNullable(props: AmountTooltipProps) {
  if (!props.amount) return <span className={props.className}>-</span>;
  return <AmountTooltip {...props} />;
}
