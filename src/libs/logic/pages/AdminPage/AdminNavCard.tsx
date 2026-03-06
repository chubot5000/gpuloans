"use client";

import { cn } from "logic/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";

const baseStyles =
  "flex w-full items-center justify-between gap-3 rounded-lg border border-outline-major bg-bg-page px-4 py-3.5 text-left text-sm text-primary transition-colors hover:border-outline-minor hover:bg-bg-primary";

interface AdminNavCardLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

interface AdminNavCardButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  type?: "button" | "submit";
}

export function AdminNavCard(props: AdminNavCardLinkProps | AdminNavCardButtonProps) {
  if ("href" in props) {
    const { href, children, className } = props;
    return (
      <Link href={href} className={cn(baseStyles, className)}>
        <span>{children}</span>
        <ChevronRightIcon className="h-5 w-5 shrink-0 text-outline-major" aria-hidden />
      </Link>
    );
  }

  const { onClick, children, className, type = "button" } = props;
  return (
    <button type={type} onClick={onClick} className={cn(baseStyles, "cursor-pointer", className)}>
      <span>{children}</span>
      <ChevronRightIcon className="h-5 w-5 shrink-0 text-outline-major" aria-hidden />
    </button>
  );
}
