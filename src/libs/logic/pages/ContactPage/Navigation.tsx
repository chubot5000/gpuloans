import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";
import { Logo } from "ui/assets";

export function Navigation() {
  return (
    <div className="flex flex-col gap-8">
      <Link aria-label="gpuLoans.com Homepage" href="/" className="flex flex-row gap-2 items-center w-fit">
        <Logo className="h-5 w-fit" variant="light" />
      </Link>

      <Link href="/" className="flex items-center w-fit md:hidden gap-2 text-white">
        <ChevronLeftIcon className="h-5 w-5" />
        Back
      </Link>
    </div>
  );
}
