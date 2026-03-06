"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useApplication } from "logic/pages";
import { cn } from "logic/utils";
import { CheckIcon, ChevronDownIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "ui/components";

interface ApplicationSelectorProps {
  className?: string;
}

export function ApplicationSelector(props: ApplicationSelectorProps) {
  const { className } = props;
  const { activeDeals, dealDetail } = useApplication();

  if (!activeDeals?.length) {
    return (
      <div
        className={cn(
          "relative flex items-center gap-2 px-4 py-2 bg-bg-primary hover:bg-bg-primary/80 transition-colors",
          className,
        )}
      >
        <span className="text-text-secondary">No applications</span>
      </div>
    );
  }

  return (
    <Menu as="div" className={cn("relative", className)}>
      {({ open }) => (
        <>
          <MenuButton className="flex items-center whitespace-nowrap gap-2 px-4 py-2 bg-bg-primary cursor-pointer">
            <span className="text-fill-primary tracking-[-0.14px]">
              Application <span className="font-medium">#{dealDetail.id}</span>
            </span>
            <ChevronDownIcon
              className={cn("size-5 text-brown-700 transition-transform duration-200", { "rotate-180": open })}
            />
          </MenuButton>

          <MenuItems
            anchor="bottom start"
            transition
            className={cn(
              "z-50 mt-2 min-w-[220px] origin-top-left bg-bg-page shadow-lg py-1 max-h-64",
              "border border-outline-major overflow-y-auto shadow-md",
              "transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
            )}
          >
            {activeDeals.map((deal) => (
              <MenuItem key={deal.id}>
                {({ focus }) => (
                  <Button
                    as={Link}
                    type="button"
                    href={`/applications/${deal.id}`}
                    className={cn(
                      "btn-tertiary border-0 flex justify-between gap-2 items-center w-full px-4 py-3 text-left transition-colors",
                      focus && "bg-bg-primary",
                      dealDetail.id === deal.id && "bg-bg-primary",
                    )}
                  >
                    <span className="text-fill-dark text-sm">Application #{deal.id}</span>

                    {dealDetail.id === deal.id && <CheckIcon className="size-4 text-fill-dark" />}
                  </Button>
                )}
              </MenuItem>
            ))}
          </MenuItems>
        </>
      )}
    </Menu>
  );
}
