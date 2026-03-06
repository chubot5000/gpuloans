"use client";

import { Navbar } from "logic/components";
import { cn } from "logic/utils";
import type { ReactNode } from "react";

import { Footer } from "../Footer";

export function Layout({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-hidden max-h-screen pt-(--nav-height)", className)}>
      <Navbar className="fixed inset-x-0 top-0 z-50 bg-white" />
      <main
        className="flex flex-col overflow-y-auto w-full h-[calc(100vh-var(--nav-height))]"
        style={{ scrollbarGutter: "stable" }}
      >
        <div className="mx-auto w-full px-4 md:px-8 py-10 flex justify-center flex-1">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
