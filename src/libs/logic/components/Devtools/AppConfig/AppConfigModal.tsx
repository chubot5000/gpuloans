"use client";

import { Switch } from "@headlessui/react";
import { useAdmin } from "logic/components";
import { Modal } from "ui/components";

import { useDevtools } from "../components";

import { NetworkSwitcher } from "./NetworkSwitcher";

export function AppConfigModal() {
  const { isAppConfigOpen, setIsAppConfigOpen } = useDevtools();
  const { isAdmin, isAdminMode, toggleAdminMode } = useAdmin();

  return (
    <Modal className="overflow-y-visible" isOpen={isAppConfigOpen} onClose={() => setIsAppConfigOpen(false)}>
      <Modal.Title>App config</Modal.Title>
      <Modal.Children className="gap-2 overflow-y-visible text-text-primary">
        <NetworkSwitcher />
        {isAdmin && (
          <div className="flex items-center justify-between gap-2">
            <span>Admin Mode</span>
            <Switch
              checked={isAdminMode}
              className={`
                group inline-flex h-6 w-11 items-center rounded-full bg-stone-200 transition
                data-checked:bg-primary
              `}
              onChange={toggleAdminMode}
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
            </Switch>
          </div>
        )}
      </Modal.Children>
    </Modal>
  );
}
