import { cn, type PolymorphProps } from "logic/utils";
import type { ElementType, ReactNode } from "react";
import { BaseRowTemplate } from "ui/components";

type AdminDealsRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  {
    children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode, ReactNode];
    className?: string;
  }
>;

export function AdminDealsRowTemplate(props: AdminDealsRowTemplateProps<ElementType>) {
  const { className, children, ...rest } = props;

  return (
    <BaseRowTemplate
      {...rest}
      className={cn("flex shrink-0 gap-2 border-b border-outline-minor px-2 py-2 *:flex *:items-center", className)}
    >
      <div className="flex-[0.8] min-w-0">{children[0]}</div>
      <div className="flex-[2] min-w-0">{children[1]}</div>
      <div className="flex-[1.5] min-w-0 justify-center">{children[2]}</div>
      <div className="flex-[1.8] min-w-0 justify-center">{children[3]}</div>
      <div className="flex-[1.2] min-w-0 justify-center">{children[4]}</div>
      <div className="w-[110px] shrink-0 justify-center">{children[5]}</div>
      <div className="w-18 md:w-28 shrink-0 justify-center">{children[6]}</div>
    </BaseRowTemplate>
  );
}
