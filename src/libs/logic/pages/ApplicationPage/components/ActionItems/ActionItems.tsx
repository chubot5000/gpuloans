"use client";

import { useHover, useScrollArrows } from "logic/hooks";
import { cn } from "logic/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRef } from "react";

import { useApplication } from "../../ApplicationPageProvider";

import { ActionItem } from "./ActionItem";

export function ActionItems() {
  const {
    dealId,
    task: { todo },
  } = useApplication();
  const wrapperRef = useRef<HTMLDivElement>(null!);
  const isHovered = useHover(wrapperRef);
  const { scrollContainerRef, canScrollLeft, canScrollRight, handleScroll } = useScrollArrows([todo]);

  if (todo.length === 0) return null;

  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex gap-2.5 items-center">
        <h3 className="text-xl font-medium font-eiko">Action Items</h3>
        <span className="w-8 h-6 flex items-center justify-center bg-fill-primary text-sm text-text-light-primary">
          {todo.length}
        </span>
      </div>

      <div ref={wrapperRef} className="relative">
        {/* Left shadow */}
        <div
          className={cn(
            "absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-bg-page via-bg-page/60 to-transparent pointer-events-none z-[5] transition-opacity duration-200",
            canScrollLeft ? "opacity-100" : "opacity-0",
          )}
        />

        {/* Right shadow */}
        <div
          className={cn(
            "absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-bg-page via-bg-page/60 to-transparent pointer-events-none z-[5] transition-opacity duration-200",
            canScrollRight ? "opacity-100" : "opacity-0",
          )}
        />

        <div ref={scrollContainerRef} className="flex gap-4 w-full overflow-x-auto no-scroll p-4 bg-bg-primary">
          {todo.map((step) => (
            <ActionItem
              key={step.id}
              type={step.type}
              state={step.state}
              title={step.title}
              href={`/applications/${dealId}?step=${step.stepSlug}`}
              className="w-[calc(50%-4px)] md:w-72 flex-shrink-0"
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => handleScroll("left")}
          className={cn(
            "absolute -left-3.5 top-1/2 -translate-y-1/2 bg-white border border-outline-minor p-1 transition-opacity duration-200 z-20",
            !isHovered && "opacity-0",
            isHovered && canScrollLeft && "opacity-100 shadow-md",
            isHovered && !canScrollLeft && "opacity-50 cursor-not-allowed",
          )}
          disabled={!canScrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeftIcon className="size-5 text-primary" />
        </button>

        <button
          type="button"
          onClick={() => handleScroll("right")}
          className={cn(
            "absolute -right-3.5 top-1/2 -translate-y-1/2 bg-white border border-outline-minor p-1 transition-opacity duration-200 z-20",
            !isHovered && "opacity-0",
            isHovered && canScrollRight && "opacity-100 shadow-md",
            isHovered && !canScrollRight && "opacity-50 cursor-not-allowed",
          )}
          aria-label="Scroll right"
          disabled={!canScrollRight}
        >
          <ChevronRightIcon className="size-5 text-primary" />
        </button>
      </div>
    </section>
  );
}
