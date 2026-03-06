import { Tab, TabList } from "@headlessui/react";
import { cn } from "logic/utils";

export enum TabEnum {
  LIVE,
  TEST,
}

export const ADMIN_PAGE_TABS: Record<TabEnum, { label: string }> = {
  [TabEnum.TEST]: { label: "Test Applications" },
  [TabEnum.LIVE]: { label: "Live Applications" },
};

export function AdminNavTabs({ className }: { className?: string }) {
  return (
    <TabList
      className={cn(
        "grid w-full grid-cols-2 divide-x divide-outline-major border border-outline-major md:w-fit md:min-w-96",
        className,
      )}
    >
      {Object.values(ADMIN_PAGE_TABS).map((tab, index) => (
        <Tab
          key={`${tab.label}-${index}`}
          className={cn(
            "h-10 cursor-pointer px-1 text-sm text-outline-major outline-none md:min-w-36 md:px-4",
            "text-xs data-selected:bg-secondary data-selected:text-primary-light",
          )}
        >
          {tab.label}
        </Tab>
      ))}
    </TabList>
  );
}
