"use client";

import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "logic/utils";
import { PlusIcon } from "lucide-react";

interface Props {
  title: string;
  children: React.ReactNode;
  index: number;
  open: boolean;
  onToggle: () => void;
}

export function FaqItem(props: Props) {
  const { title, children, index, open, onToggle } = props;

  return (
    <Disclosure as="li">
      <article
        className={cn(
          "flex w-full flex-col justify-center border-b px-4 py-4 transition-colors duration-300 ease-in-out md:px-6",
          "border-outline-minor",
        )}
      >
        <DisclosureButton
          className={cn(
            `flex w-full items-center justify-between gap-3 text-left text-base md:text-xl`,
            "transition-colors duration-200 ease-out font-polar text-[#79716B]",
          )}
          onClick={(e) => {
            e.preventDefault();
            onToggle();
          }}
        >
          <div className="flex gap-4 items-start">
            <span className={cn("inline-block min-w-6 text-right")}>{(index + 1).toString().padStart(2, "0")}</span>
            <span>{title}</span>
          </div>
          <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <PlusIcon className="size-4 md:size-5 text-brown-500" />
          </motion.div>
        </DisclosureButton>

        <AnimatePresence initial={false}>
          {open && (
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
                className="overflow-hidden text-base"
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
                <motion.div
                  animate={{ y: 0, opacity: 1 }}
                  className="pt-6 pr-5 pb-1 pl-10 text-primary md:pt-9 md:pb-3 font-polar"
                  exit={{ y: -10, opacity: 0 }}
                  initial={{ y: 10, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {children}
                </motion.div>
              </motion.div>
            </DisclosurePanel>
          )}
        </AnimatePresence>
      </article>
    </Disclosure>
  );
}
