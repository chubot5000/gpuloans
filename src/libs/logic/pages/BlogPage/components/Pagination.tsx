"use client";

import { cn } from "logic/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useMemo } from "react";

import { useBlogPage } from "../BlogPageProvider";

type PageNumber = number | "ellipsis";

const VISIBLE_PAGE_THRESHOLD = 7;
const PAGES_AROUND_CURRENT = 1;

interface NavButtonProps {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}

function NavButton({ direction, disabled, onClick }: NavButtonProps) {
  const Icon = direction === "previous" ? ChevronLeftIcon : ChevronRightIcon;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex h-7 w-7 items-center justify-center md:h-8 md:w-8 transition-colors text-[#A99482]",
        "disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent",
      )}
    >
      <Icon className="w-4 h-4 md:h-5 md:w-5" />
    </button>
  );
}

interface PageButtonProps {
  page: number;
  isActive: boolean;
  onClick: (page: number) => void;
}

function PageButton({ page, isActive, onClick }: PageButtonProps) {
  return (
    <button
      onClick={() => onClick(page)}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex h-7 w-7 items-center justify-center text-[#A99482] md:h-8 md:w-8",
        "text-xs font-medium transition-all duration-200 md:text-sm",
        isActive ? "border border-[#A99482] font-semibold" : "bg-transparent hover:bg-brown-100/50",
      )}
    >
      {page}
    </button>
  );
}

function Ellipsis() {
  return (
    <div
      className="flex justify-center items-center w-8 h-8 select-none text-[#A99482] md:h-9 md:w-9"
      aria-hidden="true"
    >
      <span className="pb-2 text-lg leading-none">...</span>
    </div>
  );
}

function generatePageNumbers(currentPage: number, totalPages: number): PageNumber[] {
  if (totalPages <= VISIBLE_PAGE_THRESHOLD) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const pages: PageNumber[] = [1];
  const rangeStart = Math.max(2, currentPage - PAGES_AROUND_CURRENT);
  const rangeEnd = Math.min(totalPages - 1, currentPage + PAGES_AROUND_CURRENT);

  if (rangeStart > 2) pages.push("ellipsis");

  for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);

  if (rangeEnd < totalPages - 1) pages.push("ellipsis");

  pages.push(totalPages);

  return pages;
}

export function Pagination() {
  const { currentPage, totalPages, setCurrentPage } = useBlogPage();

  const pageNumbers = useMemo(() => generatePageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <div className="flex flex-col gap-6 items-center mt-5 w-full md:mt-12">
      <nav
        role="navigation"
        aria-label="pagination"
        className="flex flex-wrap gap-1 justify-center items-center p-2 rounded-2xl md:gap-2"
      >
        <NavButton direction="previous" disabled={!canGoPrevious} onClick={() => setCurrentPage(currentPage - 1)} />

        <div className="flex items-center gap-0.5 md:gap-1">
          {pageNumbers.map((page, index) =>
            page === "ellipsis" ? (
              <Ellipsis key={`ellipsis-${index}`} />
            ) : (
              <PageButton key={page} page={page} isActive={currentPage === page} onClick={setCurrentPage} />
            ),
          )}
        </div>

        <NavButton direction="next" disabled={!canGoNext} onClick={() => setCurrentPage(currentPage + 1)} />
      </nav>
    </div>
  );
}
