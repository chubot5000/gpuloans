import { CalendarIcon } from "@heroicons/react/24/outline";
import { cn, formatDate, PolymorphProps } from "logic/utils";
import { ElementType, ReactNode, useMemo, useState } from "react";
import { AmountTooltip, Drawer } from "ui/components";

import { Loan } from "../data";

import { calcPaymentSchedule } from "./calcPaymentSchedule";

type Props = {
  loan: Loan;
  className?: string;
};

export function PaymentSchedule(props: Props) {
  const { loan, className } = props;

  const [isScheduleOpen, setIsScheduleOpen] = useState(false);

  const { repayments, totalPrincipal, totalInterest, startTimestamp } = useMemo(
    () => calcPaymentSchedule(loan),
    [loan],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setIsScheduleOpen(true)}
        className={cn("flex items-center gap-1 text-sm text-text-secondary", className)}
      >
        <CalendarIcon className="size-4 inline" />
        View Schedule
      </button>

      <Drawer
        isOpen={isScheduleOpen}
        onClose={() => setIsScheduleOpen(false)}
        className="w-full max-w-4xl relative flex flex-col bg-bg-page !p-0"
      >
        <div className="flex-1 p-4 sm:p-12 sm:pb-8">
          <Drawer.Title>Payment Schedule</Drawer.Title>
          <PaymentRowTemplate className="uppercase text-text-secondary border-t border-b py-2">
            <>Date</>
            <>Principal</>
            <>Interest</>
            <>Total</>
          </PaymentRowTemplate>

          <PaymentRowTemplate className="py-3.5 bg-bg-primary border-b border-outline-minor">
            <span className="text-text-secondary">REMAINING</span>

            <AmountTooltip amount={totalPrincipal} decimals={loan.erc20.decimals} className="text-secondary" />
            <AmountTooltip amount={totalInterest} decimals={loan.erc20.decimals} className="text-secondary" />
            <AmountTooltip
              amount={totalPrincipal + totalInterest}
              decimals={loan.erc20.decimals}
              className="text-secondary"
            />
          </PaymentRowTemplate>

          {repayments.map((repayment) => {
            const date = startTimestamp + loan.repaymentInterval * repayment.interval;

            return (
              <PaymentRowTemplate key={repayment.interval} className="py-2">
                <span className="text-text-secondary">{formatDate(date)}</span>
                <AmountTooltip amount={repayment.principal} decimals={loan.erc20.decimals} className="text-secondary" />
                <AmountTooltip amount={repayment.interest} decimals={loan.erc20.decimals} className="text-secondary" />
                <AmountTooltip amount={repayment.total} decimals={loan.erc20.decimals} />
              </PaymentRowTemplate>
            );
          })}
        </div>
      </Drawer>
    </>
  );
}

type PaymentRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

function PaymentRowTemplate<T extends ElementType>(props: PaymentRowTemplateProps<T>) {
  const { as: Component = "div", className, children, ...rest } = props;

  return (
    <Component
      className={cn("grid grid-cols-4 [&>div]:flex [&>div]:items-center text-xs sm:text-sm px-4", className)}
      {...rest}
    >
      <div className="">{children[0]}</div>
      <div className="justify-center">{children[1]}</div>
      <div className="justify-center">{children[2]}</div>
      <div className="justify-center">{children[3]}</div>
    </Component>
  );
}
