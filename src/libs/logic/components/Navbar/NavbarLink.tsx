"use client";

import { cn } from "logic/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavbarLinkProps {
  href: string;
  extraActivePaths?: string[] | string;
  children: React.ReactNode;
}

/**
 * A navigation link that highlights when the current route matches `href` or any of the `extraActivePaths`.
 * Matches both exact paths and nested routes.
 *
 * @param props.href - The destination URL for the link
 * @param props.extraActivePaths - Additional path prefixes that should highlight this link as active
 * @param props.children - The link content
 */
export function NavbarLink(props: NavbarLinkProps) {
  const { href, extraActivePaths, children } = props;
  const pathname = usePathname();

  const matchesPath = (path: string) => pathname === path || pathname.startsWith(`${path}/`);

  const extraPaths = extraActivePaths ? (Array.isArray(extraActivePaths) ? extraActivePaths : [extraActivePaths]) : [];
  const isActive = matchesPath(href) || extraPaths.some(matchesPath);

  return (
    <Link
      href={href}
      className={cn("px-4 text-brown-900 hover:text-secondary text-center whitespace-nowrap", {
        "text-secondary": isActive,
      })}
    >
      {children}
    </Link>
  );
}
