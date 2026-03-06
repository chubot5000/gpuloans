"use client";

import { motion } from "framer-motion";
import { cn } from "logic/utils";

import { SidebarItems } from "./SidebarItems";
import { useSidebar } from "./SidebarProvider";

export function Sidebar({ className }: { className?: string }) {
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebar();

  return (
    <motion.div
      animate={{
        width: isSidebarExpanded ? "200px" : "60px",
        transition: { type: "spring", mass: 0.5, stiffness: 120, damping: 20 },
      }}
      className={cn(
        `fixed top-[60px] left-0 z-90 h-[calc(100vh-60px)] border-r border-outline-major bg-bg-page py-8`,
        "overflow-x-hidden overflow-y-auto",
        className,
      )}
      initial={false}
      onMouseEnter={() => setIsSidebarExpanded(true)}
      onMouseLeave={() => setIsSidebarExpanded(false)}
    >
      <SidebarItems />
    </motion.div>
  );
}
