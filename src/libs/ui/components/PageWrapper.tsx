import { cn } from "logic/utils";

interface PageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function PageWrapper(props: PageWrapperProps) {
  const { children, className } = props;

  return (
    <div
      className={cn(
        "flex flex-col w-full max-w-[1520px] gap-8 flex-1 min-h-[calc(100vh-var(--nav-height)-80px)]",
        className,
      )}
    >
      {children}
    </div>
  );
}
