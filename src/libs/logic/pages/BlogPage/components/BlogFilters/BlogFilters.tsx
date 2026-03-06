"use client";

import { motion, Variants } from "framer-motion";

import { useBlogPage } from "../../BlogPageProvider";
import { Tag } from "../Tag";

export function BlogFilters() {
  const { availableTags, selectedFilter, setSelectedFilter } = useBlogPage();

  const handleFilterClick = (tag: string) => {
    if (selectedFilter === tag) setSelectedFilter(null);
    else setSelectedFilter(tag);
  };

  const variant: Variants = {
    hidden: { y: 5, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut", delay: 0.2 },
    },
    hover: { transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <>
      <motion.div
        variants={variant}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="hover"
        className="flex flex-wrap gap-4 justify-between items-center w-full max-w-screen-xl lg:gap-14"
      >
        <div className="flex overflow-x-auto gap-2 items-center w-full md:w-fit scrollbar-hide">
          <div className="flex gap-2">
            {availableTags.map((tag) => (
              <button onClick={() => handleFilterClick(tag)} key={`${tag}-filter-button`}>
                <Tag isSelected={selectedFilter === tag} label={tag} />
              </button>
            ))}
          </div>
        </div>
      </motion.div>
    </>
  );
}
