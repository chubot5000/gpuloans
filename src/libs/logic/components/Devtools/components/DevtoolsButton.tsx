"use client";

import { useWeb3 } from "logic/components";
import { DramaIcon, SettingsIcon } from "lucide-react";

import { AppConfigModal } from "../AppConfig";

import { DevtoolsModal } from "./DevtoolsModal";
import { useDevtools } from "./DevtoolsProvider";
import { ImpersonatorModal } from "./ImpersonatorModal";

export function DevtoolsButton() {
  const { address } = useWeb3();
  const { setIsDevtoolsOpen, impersonatedAddress, setIsImpersonatorOpen } = useDevtools();

  return (
    <>
      {(address || impersonatedAddress) && (
        <div className="flex gap-2 items-center">
          {impersonatedAddress && (
            <button
              onClick={() => setIsImpersonatorOpen(true)}
              type="button"
              title="Impersonate"
              className="flex items-center px-1.5 h-7.5 border border-primary"
            >
              <DramaIcon className="size-4 text-primary" />
            </button>
          )}
          <button
            onClick={() => setIsDevtoolsOpen(true)}
            type="button"
            title="Devtools"
            className="items-center px-1.5 h-7.5 border border-primary"
          >
            <SettingsIcon className="size-4 text-primary" />
          </button>
        </div>
      )}

      <DevtoolsModal />
      <ImpersonatorModal />
      <AppConfigModal />
    </>
  );
}
