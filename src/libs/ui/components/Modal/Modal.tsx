"use client";

import { Dialog, DialogTitle, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "logic/utils";
import { Fragment, type ReactNode, type RefObject } from "react";

import { ModalComponents } from "./ModalComponents";

export interface ModalBaseProps {
  isOpen: boolean;
  onClose?: (() => void) | ((b: boolean) => void);
  afterClose?: () => void;
  initialFocus?: RefObject<HTMLElement | null>;
}

export type ModalProps = ModalBaseProps & {
  children?: ReactNode;
  className?: string;
  dialogClassName?: string;
  showCloseButton?: boolean;
  overlayClassName?: string;
};

function _Modal(props: ModalProps) {
  const {
    isOpen,
    onClose: _onClose,
    afterClose,
    initialFocus,
    children,
    className,
    dialogClassName,
    showCloseButton = true,
    overlayClassName,
  } = props;

  function onClose(b: boolean) {
    _onClose?.(b);
  }

  return (
    <Transition appear as={Fragment} show={isOpen}>
      <Dialog as="div" className={cn("relative z-99", dialogClassName)} initialFocus={initialFocus} onClose={onClose}>
        <ModalComponents.Overlay afterLeave={afterClose} className={overlayClassName} />

        <ModalComponents.Panel
          className={cn(
            `relative flex flex-col bg-white text-left align-middle transition-all`,
            `h-[80vh] max-h-full max-sm:w-full sm:h-auto sm:min-w-122.5`,
            `px-6 pt-12 pb-4 sm:mx-4 sm:px-8 sm:py-12 sm:pb-8`,
            "overflow-y-auto border border-outline-major",
            className,
          )}
        >
          {showCloseButton && _onClose ? (
            <button
              className="absolute top-0 right-0 z-10 mr-3 flex h-12 items-center"
              onClick={() => _onClose(false)}
              type="button"
            >
              <XMarkIcon className="size-6 stroke-2 text-primary" />
            </button>
          ) : null}

          {children}
        </ModalComponents.Panel>
      </Dialog>
    </Transition>
  );
}

interface ModalChildrenProps {
  children: ReactNode;
  className?: string;
}

function _ModalChildren(props: ModalChildrenProps) {
  const { children, className } = props;

  return <div className={cn(`flex flex-col overflow-y-auto pt-6 sm:h-auto`, className)}>{children}</div>;
}

function _ModalTitle(props: ModalChildrenProps) {
  const { children, className } = props;

  return (
    <DialogTitle
      className={cn(
        `absolute top-0 left-0 flex h-12 w-full items-center px-6 text-left text-base`,
        "border-b border-outline-major bg-white",
        className,
      )}
    >
      {children}
    </DialogTitle>
  );
}

export const Modal = Object.assign(_Modal, {
  Title: _ModalTitle,
  Children: _ModalChildren,
});
