"use client";

import { DialogPanel, TransitionChild } from "@headlessui/react";
import { cn } from "logic/utils";
import { Fragment, type ReactNode } from "react";

interface OverlayProps {
  afterLeave?: () => void;
  className?: string;
}

function Overlay(props: OverlayProps) {
  return (
    <TransitionChild
      afterLeave={props.afterLeave}
      as={Fragment}
      enter="ease-out duration-300"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="ease-in duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className={cn("fixed inset-0 bg-[#34271C]/53 backdrop-blur-xs", props.className)} />
    </TransitionChild>
  );
}

interface PanelProps {
  children: ReactNode;
  className?: string;
}

function Panel(props: PanelProps) {
  const { children, className } = props;

  return (
    <div
      className="flex overflow-hidden fixed inset-0 justify-end items-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      role="dialog"
    >
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="ease-in duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <DialogPanel className={className}>{children}</DialogPanel>
      </TransitionChild>
    </div>
  );
}

export const DrawerComponents = { Overlay, Panel };
