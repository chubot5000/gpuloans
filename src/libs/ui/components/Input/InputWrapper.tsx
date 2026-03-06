import { cn, type PolymorphProps } from "logic/utils";
import type { ElementType, Ref } from "react";

export function InputWrapper<T extends ElementType = "div">(
  props: PolymorphProps<T, { componentRef?: Ref<HTMLDivElement> }>,
) {
  const { as: Component = "div", componentRef, className, ...rest } = props;

  return (
    <Component
      className={cn(
        `group focus-within-outline relative flex h-11 items-center border border-outline-major bg-white dark:bg-white`,
        className,
      )}
      ref={componentRef}
      {...rest}
    />
  );
}

/*
 * Convenience wrapper
 */
export function ButtonInputWrapper(props: Omit<PolymorphProps<"button">, "as">) {
  return <InputWrapper as="button" {...props} />;
}
