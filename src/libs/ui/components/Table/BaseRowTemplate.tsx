import { cn, type PolymorphProps } from "logic/utils";
import type { ElementType, ReactNode } from "react";

type BaseRowTemplateProps<T extends ElementType> = PolymorphProps<T, { children: ReactNode[] }>;

export function BaseRowTemplate<T extends ElementType>(props: BaseRowTemplateProps<T>) {
  const { as: Component = "div", children, componentRef, className, ...rest } = props;

  return (
    // @ts-expect-error - componentRef is not typed
    <Component {...rest} className={cn("grid grid-cols-12 gap-4", className)} ref={componentRef}>
      {children}
    </Component>
  );
}
