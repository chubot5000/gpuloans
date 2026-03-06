"use client";

import { useAdmin } from "logic/components";
import { cn } from "logic/utils";
import Link from "next/link";
import { Logo } from "ui/assets";
import { Button } from "ui/components";

import { DevtoolsButton } from "../Devtools";
import { SidebarMobile, useSidebar } from "../Sidebar";

import { MenuButton } from "./MenuButton";
import { NavbarLink } from "./NavbarLink";
import { WalletButton } from "./WalletButton";

interface TopBarProps {
  className?: string;
  isHomepage?: boolean;
}

export function Navbar(props: TopBarProps) {
  const { className, isHomepage = false } = props;

  const { isSidebarExpanded, setIsSidebarExpanded } = useSidebar();
  const { isAdminMode } = useAdmin();

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <div
        className={cn(
          "relative flex h-[60px] items-center px-4 md:px-8",
          !isHomepage && "border-b border-outline-minor",
        )}
      >
        <div className="flex flex-row gap-10 items-center">
          <div className="flex flex-row gap-4 items-center">
            <MenuButton
              className="relative z-40 md:hidden"
              isOpen={isSidebarExpanded}
              setIsOpen={setIsSidebarExpanded}
            />
            <Link aria-label="GPULoans Homepage" href="/">
              <Logo hideText className="h-5 w-7 sm:hidden" />
              <Logo className="h-5 w-fit max-sm:hidden" />
            </Link>
          </div>

          <div className="flex flex-row gap-2 items-center max-md:hidden">
            <NavbarLink href="/applications">Applications</NavbarLink>
            <NavbarLink href="/loans">Loans</NavbarLink>
            <NavbarLink href="/blog">Blog</NavbarLink>
            {isAdminMode && <NavbarLink href="/admin/applications">All Applications</NavbarLink>}
          </div>
        </div>

        <div className="grow" />

        <div className="ml-4 flex h-7.5 flex-row items-center gap-1 lg:gap-2">
          {isAdminMode && (
            <span className="flex items-center justify-center px-2 h-7.5 bg-red-200 text-red-900 shrink-0">Admin</span>
          )}
          {isHomepage ? (
            <>
              <Button as={Link} href="/contact" className="px-9">
                Apply Now
              </Button>
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center">
              <DevtoolsButton />
              <WalletButton />
            </div>
          )}
        </div>

        <SidebarMobile isOpen={isSidebarExpanded} setIsOpen={setIsSidebarExpanded} />
      </div>
    </div>
  );
}
