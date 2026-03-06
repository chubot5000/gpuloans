"use client";

import { motion } from "framer-motion";
import { cn } from "logic/utils";

interface TagProps {
  label: string;
  isSelected?: boolean;
  onClick?: () => void;
}

export function Tag(props: TagProps) {
  const { label, isSelected = false, onClick } = props;

  return (
    <motion.span
      className={cn(
        "px-4 py-1.5 text-sm rounded-full border transition-all duration-300 flex items-center gap-x-3 gap-y-4 shrink-0",
        isSelected ? "bg-brown-700 text-brown-100 border-brown-500" : "text-[#A99482] border-[#A99482]",
      )}
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      whileTap={{ scale: 0.95 }}
      variants={{
        width: isSelected
          ? { width: "auto", transition: { duration: 0.3 } }
          : { width: "100%", transition: { duration: 0.3 } },
      }}
      initial="width"
      animate="width"
    >
      {label}
    </motion.span>
  );
}
