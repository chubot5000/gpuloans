import { cn } from "logic/utils";
import { ReactNode } from "react";

type MsgProps = {
  className?: string;
  children: ReactNode;
};

export function Msg(props: MsgProps) {
  const { className, children } = props;
  return <span className={cn("text-text-secondary", className)}>{children}</span>;
}
