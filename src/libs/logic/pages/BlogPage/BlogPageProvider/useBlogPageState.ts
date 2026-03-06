import { Post as BlogPost } from 'data/fetchers';
import { useCallback, useEffect, useMemo, useState } from 'react';


const DEFAULT_PAGE_SIZE = 6;

export function useBlogPageState(posts: BlogPost[]) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);

  const pageSize = DEFAULT_PAGE_SIZE;

  const sortedPosts = useMemo(() => [...posts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()), [posts]);

  const uniqueTags = useMemo(() => [...new Set(sortedPosts.flatMap((post) => post.tags))], [sortedPosts]);

  const highlightedPost = sortedPosts[0];

  const filteredPosts = useMemo(() => {
    return sortedPosts.slice(1).filter((post) => {
      const matchesFilter = !selectedFilter || post.tags.includes(selectedFilter);
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [sortedPosts, selectedFilter, searchQuery]);

  const paginationData = useMemo(() => {
    const total = filteredPosts.length;
    const pages = Math.ceil(total / pageSize) || 1;
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filteredPosts.slice(start, end);

    return {
      totalFilteredPosts: total,
      totalPages: pages,
      paginatedPosts: paginated,
    };
  }, [filteredPosts, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedFilter, searchQuery]);

  const resetPage = useCallback(() => setCurrentPage(1), []);

  return {
    selectedFilter,
    setSelectedFilter,
    highlightedPost,
    filteredPosts: paginationData.paginatedPosts,
    allFilteredPosts: filteredPosts,
    availableTags: uniqueTags,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    pageSize,
    totalPages: paginationData.totalPages,
    totalFilteredPosts: paginationData.totalFilteredPosts,
    resetPage,
  };
}
