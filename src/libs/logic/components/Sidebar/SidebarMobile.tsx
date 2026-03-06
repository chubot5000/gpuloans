"use client";

import { motion } from "framer-motion";
import { cn } from "logic/utils";
import { useEffect } from "react";

import { SidebarItems } from "./SidebarItems";

interface SidebarMobileProps {
  className?: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export function SidebarMobile(props: SidebarMobileProps) {
  const { className, isOpen, setIsOpen } = props;

  const sidebarVariants = {
    open: { x: 0 },
    closed: { x: "-100%" },
  };

  const backdropVariants = {
    open: { opacity: 1 },
    closed: { opacity: 0 },
  };

  const variant = isOpen ? "open" : "closed";

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  return (
    <>
      <motion.div
        animate={variant}
        className={cn(
          "fixed inset-0 top-[56px] z-87 h-[calc(100dvh-56px)] bg-bg-page/50",
          isOpen ? "block" : "-z-50 hidden",
        )}
        initial="closed"
        onClick={() => setIsOpen(false)}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        variants={backdropVariants}
      />

      <motion.div
        animate={variant}
        className={cn(
          "no-scroll fixed top-[60px] left-0 z-88 flex flex-col pt-3",
          `h-[calc(100dvh-60px)] w-[80%] max-w-[250px] overflow-y-auto bg-white md:hidden`,
          className,
        )}
        initial="closed"
        transition={{ duration: 0.5, ease: "easeInOut" }}
        variants={sidebarVariants}
      >
        <SidebarItems />
      </motion.div>
    </>
  );
}
