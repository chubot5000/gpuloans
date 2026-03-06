"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import type { PipedriveFile } from "data/fetchers";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { Spinner } from "ui/components";

import { PreviousVersionsTable } from "./PreviousVersionsTable";

interface PreviousVersionsSectionProps {
  files: PipedriveFile[] | undefined;
  isLoading: boolean;
}

export function PreviousVersionsSection({ files, isLoading }: PreviousVersionsSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!files || files.length === 0) return null;

  return (
    <Disclosure as="div">
      <DisclosureButton
        className="flex w-full items-center text-left text-sm text-text-secondary transition-colors hover:text-text-primary"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>View Previous Versions</span>
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <ChevronDownIcon className="size-4" />
        </motion.div>
      </DisclosureButton>

      <AnimatePresence initial={false}>
        {isOpen && (
          <DisclosurePanel static>
            <motion.div
              animate={{
                height: "auto",
                opacity: 1,
                transition: {
                  height: {
                    type: "spring",
                    stiffness: 400,
                    damping: 30,
                  },
                  opacity: { duration: 0.15 },
                },
              }}
              className="overflow-hidden"
              exit={{
                height: 0,
                opacity: 0,
                transition: {
                  height: { duration: 0.2, ease: "easeInOut" },
                  opacity: { duration: 0.1 },
                },
              }}
              initial={{ height: 0, opacity: 0 }}
            >
              <div className="pt-4">
                {isLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner className="size-7" />
                  </div>
                ) : (
                  <PreviousVersionsTable files={files || []} />
                )}
              </div>
            </motion.div>
          </DisclosurePanel>
        )}
      </AnimatePresence>
    </Disclosure>
  );
}
