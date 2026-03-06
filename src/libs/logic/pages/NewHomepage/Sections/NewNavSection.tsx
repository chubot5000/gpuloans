"use client";

import Image from "next/image";
import Link from "next/link";

export function NewNavSection() {
  return (
    <nav className="fixed left-0 top-0 z-50 flex w-full items-center justify-between border-b border-black/10 bg-white px-14 py-6">
      {/* Left - Logo and GPU LOANS text */}
      <div className="flex items-center gap-6">
        <Image src="/svg/gpu-loans-logo-new.svg" alt="GPU Loans" width={40} height={29} className="h-[29px] w-[40px]" />
        <span className="font-museum text-[21px] uppercase tracking-[10.5px] text-black">GPU LOANS</span>
      </div>

      {/* Center - Navigation Links */}
      <div className="flex items-center gap-32">
        <Link href="#rates" className="font-swiss text-base text-black hover:text-secondary transition-colors">
          Rates
        </Link>
        <Link href="#solutions" className="font-swiss text-base text-black hover:text-secondary transition-colors">
          Solutions
        </Link>
        <Link href="#loans" className="font-swiss text-base text-black hover:text-secondary transition-colors">
          Loans
        </Link>
      </div>

      {/* Right - CTA Button */}
      <Link
        href="/contact"
        className="flex h-[35px] w-[128px] items-center justify-center bg-secondary hover:bg-[#C4AD9A] transition-colors"
      >
        <span className="font-swiss text-base tracking-tight text-white">Get a Quote</span>
      </Link>
    </nav>
  );
}
