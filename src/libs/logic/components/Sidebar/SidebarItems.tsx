"use client";

import { QueueListIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { cn } from "logic/utils";
import { BookOpenIcon, DockIcon } from "lucide-react";
import { type ComponentType, Suspense } from "react";

import { SidebarItem } from "./SidebarItem";

interface SidebarLink {
  label: string;
  href: string[] | string;
  external?: boolean;
  icon: ComponentType<React.SVGProps<SVGSVGElement>>;
}

const sidebarLinks: SidebarLink[][] = [
  [
    {
      label: "Applications",
      href: "/applications",
      icon: DockIcon,
    },
    {
      label: "Loans",
      href: "/loans",
      icon: QueueListIcon,
    },
    {
      label: "Blog",
      href: "/blog",
      icon: BookOpenIcon,
    },
  ],
];

export function SidebarItems() {
  return (
    <Suspense>
      <SidebarItems_ />
    </Suspense>
  );
}

function SidebarItems_({ className }: { className?: string }) {
  return (
    <div className={cn("flex h-full flex-col", className)}>
      {sidebarLinks.map((group, groupIdx) => {
        return (
          <div key={`sidebar-group-${groupIdx}`} className="flex flex-col">
            {group.map((link, linkIdx) => {
              return (
                <SidebarItem
                  key={`sidebar-link-${groupIdx}-${linkIdx}`}
                  external={link.external}
                  href={link.href}
                  icon={link.icon}
                >
                  {link.label}
                </SidebarItem>
              );
            })}
            {groupIdx < sidebarLinks.length - 1 && (
              <motion.hr animate={{ transition: { duration: 0.2 } }} className="mx-3 my-2 border-outline-major" />
            )}
          </div>
        );
      })}
    </div>
  );
}
