"use client";

import { Post as BlogPost } from "data/fetchers";
import { createContext, type ReactNode, useContext } from "react";

import { useBlogPageState } from "./useBlogPageState";

type BlogPageContextType = ReturnType<typeof useBlogPageState>;

const BlogPageContext = createContext<BlogPageContextType | undefined>(undefined);

export function useBlogPage() {
  const context = useContext(BlogPageContext);
  if (!context) throw new Error("useBlogPage must be called within a BlogPageProvider");
  return context;
}

interface BlogPageProviderProps {
  children: ReactNode;
  posts: BlogPost[];
}

export function BlogPageProvider(props: BlogPageProviderProps) {
  const { children, posts } = props;
  const state = useBlogPageState(posts);

  return <BlogPageContext.Provider value={state}>{children}</BlogPageContext.Provider>;
}
