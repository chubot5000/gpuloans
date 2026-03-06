import { cn } from "logic/utils";

interface SectionWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper(props: SectionWrapperProps) {
  const { children, className, ...rest } = props;
  return (
    <section
      className={cn("relative flex-col w-full flex items-center", "h-full min-h-[38rem] overflow-hidden", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
