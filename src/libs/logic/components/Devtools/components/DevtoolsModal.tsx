"use client";

import { DramaIcon, Settings2Icon } from "lucide-react";
import { Button, Modal } from "ui/components";

import { useDevtools } from "./DevtoolsProvider";

export function DevtoolsModal() {
  const { isDevtoolsOpen, setIsDevtoolsOpen, setIsImpersonatorOpen, setIsAppConfigOpen } = useDevtools();

  return (
    <Modal className="sm:w-fit" isOpen={isDevtoolsOpen} onClose={() => setIsDevtoolsOpen(false)}>
      <Modal.Title>Devtools</Modal.Title>

      <Modal.Children className="min-w-72 gap-4">
        {/* Impersonator Button */}
        <div className="flex flex-col gap-2">
          <Button
            className="btn-primary gap-2 w-full"
            onClick={() => {
              setIsDevtoolsOpen(false);
              setIsImpersonatorOpen(true);
            }}
            title="Impersonate"
          >
            <DramaIcon className="size-6" /> Impersonate
          </Button>

          {/* App Config Button */}
          <Button
            className="btn-primary gap-2 w-full"
            onClick={() => {
              setIsDevtoolsOpen(false);
              setIsAppConfigOpen(true);
            }}
            title="Config"
          >
            <Settings2Icon className="size-6" /> Config
          </Button>
        </div>
      </Modal.Children>
    </Modal>
  );
}
