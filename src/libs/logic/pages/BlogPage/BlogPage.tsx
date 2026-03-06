import { Post as BlogPost } from "data/fetchers";

import { BlogPageProvider } from "./BlogPageProvider";
import { BlogFilters, BlogTable, LatestPost, Pagination } from "./components";
import { DotPattern } from "./components/DotPattern";

interface BlogPageProps {
  posts: BlogPost[];
}

export function BlogPage(props: BlogPageProps) {
  const { posts } = props;

  if (posts.length <= 0) {
    return (
      <main className="relative -mt-[72px] md:z-[10] flex w-full flex-1 flex-col items-center justify-center text-center md:-mt-[98px] text-black bg-background overflow-hidden">
        <DotPattern className="absolute top-0 left-0 opacity-30" />
        <div className="flex z-10 flex-col flex-wrap flex-1 gap-10 justify-center items-center p-4 py-28 w-full max-w-7xl min-h-screen">
          <h2 className="text-xl font-light text-left md:text-3xl text-brown-700">No posts found</h2>
        </div>
      </main>
    );
  }

  return (
    <BlogPageProvider posts={posts}>
      <main className="relative -mt-[72px] md:z-[10] flex w-full flex-1 flex-col items-center justify-center text-center md:-mt-[98px] text-black bg-background overflow-hidden">
        <DotPattern className="absolute top-0 left-0 opacity-30" />
        <div className="flex z-10 flex-col flex-wrap flex-1 gap-10 items-center p-4 py-28 w-full max-w-7xl min-h-screen">
          <h1 className="sr-only">GPULoans Blog</h1>
          <LatestPost />
          <BlogFilters />
          <BlogTable />
          <Pagination />
        </div>
      </main>
    </BlogPageProvider>
  );
}
