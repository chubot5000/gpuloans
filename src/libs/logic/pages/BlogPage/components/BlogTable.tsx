"use client";

import { useBlogPage } from "../BlogPageProvider";

import { BlogCard } from "./BlogCard";

export function BlogTable() {
  const { filteredPosts: posts } = useBlogPage();

  return (
    <div className="flex overflow-y-hidden justify-center w-full flex-1">
      {posts.length <= 0 ? (
        <div className="flex flex-col items-center justify-center w-full flex-1">
          <h2 className="text-xl text-left md:text-3xl font-light text-brown-700">No posts found</h2>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-3 gap-y-12 md:gap-y-16 md:gap-x-5 sm:grid-cols-2">
          {posts.map((post, idx) => (
            <BlogCard idx={idx} key={`${post.slug}-card`} {...post} />
          ))}
        </div>
      )}
    </div>
  );
}
