import type { ComponentProps, ElementType, Ref } from "react";

interface PolymorphBaseProps<T extends ElementType> {
  as?: T;
  componentRef?: Ref<unknown>;
}

export type PolymorphProps<T extends ElementType, ExtraProps = Record<string, never>> = {
  [K in keyof ComponentProps<T>]: K extends keyof ExtraProps
    ? ExtraProps[K]
    : K extends keyof PolymorphBaseProps<T>
      ? PolymorphBaseProps<T>[K]
      : ComponentProps<T>[K];
} & ExtraProps &
  PolymorphBaseProps<T>;
