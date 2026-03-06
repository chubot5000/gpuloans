import { cn, type PolymorphProps } from "logic/utils";
import type { ElementType, ReactNode } from "react";
import { BaseRowTemplate } from "ui/components";

type ApplicationsRowTemplateProps<T extends ElementType> = PolymorphProps<
  T,
  { children: [ReactNode, ReactNode, ReactNode, ReactNode, ReactNode]; className?: string }
>;

export function ApplicationsRowTemplate(props: ApplicationsRowTemplateProps<ElementType>) {
  const { className, children, ...rest } = props;

  return (
    <BaseRowTemplate
      {...rest}
      className={cn("flex shrink-0 gap-1 border-b border-outline-minor px-2 py-2 *:flex *:items-center", className)}
    >
      <div className="grow">{children[0]}</div>
      <div className="flex justify-center w-1/4">{children[1]}</div>
      <div className="flex justify-center w-1/4">{children[2]}</div>
      <div className="flex justify-center w-1/4">{children[3]}</div>
      <div className="flex justify-center w-18 md:w-28">{children[4]}</div>
    </BaseRowTemplate>
  );
}
