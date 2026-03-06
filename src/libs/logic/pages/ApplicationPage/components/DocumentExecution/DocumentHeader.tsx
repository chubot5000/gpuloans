"use client";

import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { cn } from "logic/utils";
import { DownloadIcon, EllipsisVerticalIcon } from "lucide-react";

import { TaskId } from "../../core";
import { TEMPLATES_DOCS } from "../../Steps/template_docs";

interface DocumentHeaderProps {
  taskId: TaskId;
  viewAndSignUrl: string | null;
  downloadUrl: string | null;
  viewButtonLabel?: string;
}

export function DocumentHeader(props: DocumentHeaderProps) {
  const { taskId, viewAndSignUrl, downloadUrl, viewButtonLabel = "View and Sign" } = props;
  const config = TEMPLATES_DOCS[taskId]!;

  return (
    <div className="flex flex-col gap-2 justify-between px-4 py-4 md:flex-row md:items-center md:gap-4 shadow-base">
      <span className="order-2 md:order-1">{config?.documentName}</span>
      <div className="flex order-1 gap-2 justify-end items-center md:order-2">
        {viewAndSignUrl ? (
          <a
            href={viewAndSignUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary-light btn-small"
          >
            {viewButtonLabel}
          </a>
        ) : (
          <button disabled className="btn btn-primary-light btn-small">
            {viewButtonLabel}
          </button>
        )}
        <DocumentOptionsMenu downloadUrl={downloadUrl} />
      </div>
    </div>
  );
}

interface DocumentOptionsMenuProps {
  downloadUrl: string | null;
}

function DocumentOptionsMenu({ downloadUrl }: DocumentOptionsMenuProps) {
  return (
    <Menu as="div" className="relative">
      <MenuButton
        type="button"
        disabled={!downloadUrl}
        className={cn(
          "flex size-8 items-center justify-center rounded-md text-text-secondary transition-colors outline-none focus:outline-none focus-visible:outline-none",
          !downloadUrl ? "opacity-50 cursor-not-allowed" : "hover:bg-background-tertiary hover:text-text-primary",
        )}
        aria-label="More options"
      >
        <EllipsisVerticalIcon className="size-5" />
      </MenuButton>

      <MenuItems
        anchor="bottom end"
        transition
        className={cn(
          "z-50 mt-2 min-w-[140px] origin-top-right bg-bg-page shadow-lg py-1",
          "border border-outline-major",
          "outline-none focus:outline-none focus-visible:outline-none",
          "transition duration-150 ease-out data-[closed]:scale-95 data-[closed]:opacity-0",
        )}
      >
        <MenuItem disabled={!downloadUrl}>
          {({ focus, disabled }) => (
            <a
              href={downloadUrl ?? undefined}
              download
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm text-text-primary transition-colors",
                focus && "bg-bg-primary",
                disabled && "opacity-50 cursor-not-allowed",
              )}
              onClick={(e) => {
                if (!downloadUrl || disabled) {
                  e.preventDefault();
                }
              }}
            >
              <DownloadIcon className="size-4" />
              Download
            </a>
          )}
        </MenuItem>
      </MenuItems>
    </Menu>
  );
}
