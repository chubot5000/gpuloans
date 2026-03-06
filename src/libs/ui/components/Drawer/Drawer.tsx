"use client";

import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "logic/utils";
import { Fragment, type ReactNode, type RefObject } from "react";

import { DrawerComponents } from "./DrawerComponents";

export interface DrawerBaseProps {
  isOpen: boolean;
  onClose?: (() => void) | ((b: boolean) => void);
  afterClose?: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
}

export type DrawerProps = DrawerBaseProps & {
  children?: ReactNode;
  className?: string;
  dialogClassName?: string;
  overlayClassName?: string;
  showCloseButton?: boolean;
};

function _Drawer(props: DrawerProps) {
  const {
    isOpen,
    onClose: _onClose,
    afterClose,
    initialFocus,
    children,
    className,
    dialogClassName,
    overlayClassName,
    showCloseButton = true,
  } = props;

  function onClose(b: boolean) {
    _onClose?.(b);
  }

  return (
    <Transition appear as={Fragment} show={isOpen}>
      <Dialog as="div" className={cn("relative z-99", dialogClassName)} initialFocus={initialFocus} onClose={onClose}>
        <DrawerComponents.Overlay afterLeave={afterClose} className={overlayClassName} />

        <DrawerComponents.Panel
          className={cn(
            "relative flex h-full flex-col bg-white text-left align-middle transition-all",
            "px-4 py-9 border",
            "overflow-y-auto",
            className,
          )}
        >
          {_onClose && showCloseButton ? (
            <button
              className="absolute top-5 right-5 z-10 flex items-center"
              onClick={() => _onClose(false)}
              type="button"
            >
              <XMarkIcon className="size-6 stroke-2 text-fill-secondary" />
            </button>
          ) : null}

          {children}
        </DrawerComponents.Panel>
      </Dialog>
    </Transition>
  );
}

interface DrawerChildrenProps {
  children: ReactNode;
  className?: string;
}

function _DrawerChildren(props: DrawerChildrenProps) {
  const { children, className } = props;

  return <div className={cn(`flex flex-col overflow-y-auto pt-6`, className)}>{children}</div>;
}

function _DrawerTitle(props: DrawerChildrenProps) {
  const { children, className } = props;

  return (
    <DialogTitle
      className={cn(
        "flex w-full items-center h-12 bg-white",
        "mb-4 sm:mb-6",
        "text-lg sm:text-2xl font-bold font-eiko",
        className,
      )}
    >
      {children}
    </DialogTitle>
  );
}

export const Drawer = Object.assign(_Drawer, {
  Title: _DrawerTitle,
  Children: _DrawerChildren,
});
