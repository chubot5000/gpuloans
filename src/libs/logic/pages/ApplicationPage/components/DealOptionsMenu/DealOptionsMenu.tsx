"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { cn } from "logic/utils";
import { EllipsisVerticalIcon } from "lucide-react";
import { useState } from "react";

import { ViewParticipantsModal } from "./ViewParticipantsModal";

export function DealOptionsMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Menu as="div" className="relative">
        <MenuButton
          type="button"
          className={cn(
            "flex size-9 items-center justify-center border border-primary text-primary",
            "focus:outline-none",
          )}
          aria-label="Deal Options"
        >
          <EllipsisVerticalIcon className="size-5" />
        </MenuButton>

        <MenuItems
          anchor="bottom end"
          transition
          className={cn(
            "z-50 mt-2 min-w-[180px] origin-top-right bg-bg-page py-1 shadow-lg",
            "border border-outline-major outline-none focus:outline-none",
            "transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
          )}
        >
          <MenuItem>
            {({ focus }) => (
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className={cn(
                  "flex w-full justify-center items-center gap-2 px-4 py-2 text-sm text-text-primary transition-colors",
                  focus && "bg-bg-primary",
                )}
              >
                View Participants
              </button>
            )}
          </MenuItem>
        </MenuItems>
      </Menu>

      <ViewParticipantsModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
