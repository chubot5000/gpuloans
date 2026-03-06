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
      <div className={cn("fixed inset-0 bg-white/60 backdrop-blur-xs", props.className)} />
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
      className="fixed inset-0 flex items-end justify-center overflow-hidden sm:items-center"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      role="dialog"
    >
      <TransitionChild
        as={Fragment}
        enter="ease-out duration-500 sm:duration-300"
        enterFrom="translate-y-[90%] sm:translate-y-0 sm:opacity-0 sm:scale-95"
        enterTo="translate-y-0 sm:opacity-100 sm:scale-100"
        leave="ease-in duration-500 sm:duration-300"
        leaveFrom="translate-y-0 sm:opacity-100 sm:scale-100"
        leaveTo="translate-y-full sm:translate-y-0 sm:opacity-0 sm:scale-95"
      >
        <DialogPanel className={className}>{children}</DialogPanel>
      </TransitionChild>
    </div>
  );
}

export const ModalComponents = { Overlay, Panel };
