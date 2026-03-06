"use client";

import { motion, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { useBlogPage } from "../BlogPageProvider";

export function LatestPost() {
  const { highlightedPost } = useBlogPage();

  const { slug, title, cover } = highlightedPost;

  const variant: Variants = {
    hidden: { y: 5, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut", delay: 0.1 },
    },
    hover: { transition: { duration: 0.2, ease: "easeOut" } },
  };

  return (
    <motion.div
      variants={variant}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="hover"
      className="w-full"
    >
      <Link href={`/blog/${slug}`} className="flex relative w-full font-light text-white h-fit">
        <Image
          alt={title}
          src={cover}
          width={1000}
          height={1000}
          className="object-contain sm:object-cover min-w-full md:min-h-[500px] sm:h-auto"
        />
      </Link>
    </motion.div>
  );
}
