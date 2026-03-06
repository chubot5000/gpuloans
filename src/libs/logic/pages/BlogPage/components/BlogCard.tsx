"use client";

import { Post as BlogPost } from "data/fetchers";
import dayjs from "dayjs";
import { motion, Variants } from "framer-motion";
import { cn } from "logic/utils";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

import { useBlogPage } from "../BlogPageProvider";

interface BlogCardProps extends BlogPost {
  idx: number;
}

export function BlogCard(props: BlogCardProps) {
  const { title, description, tags, cover, createdAt, slug, idx } = props;
  const { selectedFilter, searchQuery } = useBlogPage();

  const variant: Variants = {
    hidden: { y: 5, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut", delay: 0.3 + idx * 0.1 },
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
      className={cn({
        hidden:
          (selectedFilter && !tags.includes(selectedFilter)) ||
          (searchQuery && !title.toLowerCase().includes(searchQuery)),
      })}
    >
      <Link href={`/blog/${slug}`} className="flex flex-col gap-2 font-light md:gap-4 text-brown-700">
        <Image
          alt={title}
          src={cover}
          width={1000}
          height={1000}
          className="object-cover min-w-full h-auto aspect-video"
        />
        <div className="flex gap-0.5 md:gap-1 text-sm md:text-base text-brown-500">
          {tags.map((tag: string) => (
            <Fragment key={tag}>
              <span>{tag}</span>
              <span className="mx-1 md:mx-2">|</span>
            </Fragment>
          ))}
          <span>{dayjs(createdAt).format("MMM D, YYYY")}</span>
        </div>
        <h2 className="text-xl text-left md:text-3xl text-primary-light">{title}</h2>
        <p className="text-sm text-left md:text-base text-primary">{description}</p>
      </Link>
    </motion.div>
  );
}
