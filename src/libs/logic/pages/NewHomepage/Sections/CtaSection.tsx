"use client";

import Link from "next/link";

export function CtaSection() {
  return (
    <div className="relative w-full overflow-clip bg-brown-900 py-32">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.12]">
        {/* Horizontal lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/grid-horizontal.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            filter: "invert(1)",
          }}
        />
        {/* Vertical lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/grid-vertical.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            filter: "invert(1)",
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col items-center px-8">
        {/* Heading */}
        <h2 className="mb-12 max-w-[663px] text-center font-eiko text-[60px] font-normal leading-[1.13] tracking-tight text-white">
          Ready to Unlock Your Server&apos;s Value?
        </h2>

        {/* Subtitle */}
        <p className="mb-16 max-w-[686px] text-center font-museum text-lg font-light leading-relaxed text-stone-300">
          Join thousands of GPU owners who have turned their hardware into working capital. Get started in minutes with
          our simple online application.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-14">
          {/* Primary Button */}
          <Link
            href="/contact"
            className="flex items-center justify-center bg-secondary px-[60px] py-[13px] hover:bg-[#C4AD9A] transition-colors"
          >
            <span className="font-swiss text-[22px] tracking-tight text-white">Start Your Application</span>
          </Link>

          {/* Secondary Button */}
          <Link
            href="/contact"
            className="flex items-center justify-center bg-brown-100 px-[60px] py-[13px] hover:bg-brown-500 transition-colors"
          >
            <span className="font-swiss text-[22px] tracking-tight text-brown-900">Talk to an Expert</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
