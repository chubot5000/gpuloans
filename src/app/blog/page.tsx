export const dynamic = "force-dynamic";

import { getPosts } from "data/fetchers";
import { Footer } from "logic/components";
import { Navbar } from "logic/components";
import { BlogPage } from "logic/pages";
import { Metadata } from "next";

export default async function Blog() {
  const posts = await getPosts();

  return (
    <div className="flex flex-col items-center max-h-screen pt-(--nav-height)">
      <Navbar className="fixed inset-x-0 top-0 z-50 bg-white" isHomepage />

      <main
        className="flex overflow-y-auto flex-col flex-1 w-full min-h-[calc(100vh-var(--nav-height))]"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="flex flex-1 flex-col shrink-0 justify-center w-full items-center min-h-screen">
          <BlogPage posts={posts} />
        </div>

        <Footer />
      </main>
    </div>
  );
}

export const metadata: Metadata = {
  title: "Blog",
  alternates: {
    canonical: "/blog",
  },
};
