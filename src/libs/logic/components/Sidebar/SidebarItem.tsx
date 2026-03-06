"use client";

import { motion } from "framer-motion";
import { cn } from "logic/utils";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

import { useSidebar } from "./SidebarProvider";

interface SideBarItemProps {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  href: string[] | string;
  isActive?: boolean;
  children: React.ReactNode;
  external?: boolean;
}

export function SidebarItem({ icon: IconComponent, href, children, external = false }: SideBarItemProps) {
  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebar();
  const pathName = usePathname();
  const searchParams = useSearchParams();

  const currentFullPath = searchParams.toString() ? `${pathName}?${searchParams.toString()}` : pathName;

  const checkIsActive = (hrefItem: string): boolean => {
    const hasQueryParams = hrefItem.includes("?");

    if (hasQueryParams) return hrefItem === currentFullPath;

    const isExactMatch = currentFullPath === hrefItem;
    const isNestedRoute = pathName.startsWith(`${hrefItem}/`);

    return isExactMatch || isNestedRoute;
  };

  const isActive = Array.isArray(href) ? href.some(checkIsActive) : checkIsActive(href);

  useEffect(() => {
    setIsSidebarExpanded(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathName]);

  return (
    <Link
      className={cn(
        "relative h-12",
        isActive && "bg-primary text-primary-light",
        !isActive && `md:hover:bg-bg-primary`,
      )}
      href={Array.isArray(href) ? href[0] : href}
      prefetch={false}
      target={external ? "_blank" : undefined}
    >
      <div className="absolute inset-0 mx-5 flex items-center gap-3">
        <motion.div
          animate={{
            transition: {
              paddingRight: {
                delay: isSidebarExpanded ? 0 : 0.4,
                duration: isSidebarExpanded ? 0 : 0.2,
                ease: "easeOut",
              },
            },
          }}
          className="flex shrink-0 items-center justify-center"
        >
          <IconComponent className="size-5 stroke-2" />
        </motion.div>
        <motion.div
          animate={{
            opacity: isSidebarExpanded ? 1 : 0,
            transition: { opacity: { delay: 0.05, duration: 0.2 } },
          }}
          className="flex-1 overflow-hidden whitespace-nowrap"
          initial={false}
        >
          <span className="text-sm uppercase">{children}</span>
        </motion.div>
      </div>
    </Link>
  );
}
