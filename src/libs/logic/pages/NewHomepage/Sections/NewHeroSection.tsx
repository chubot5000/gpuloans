"use client";

import Link from "next/link";

export function NewHeroSection() {
  return (
    <div className="relative flex min-h-[656px] w-full items-center justify-center overflow-hidden bg-white pt-[72px]">
      {/* Grid Background */}
      <div className="absolute inset-0 opacity-[0.12]">
        {/* Horizontal lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/grid-horizontal.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
        {/* Vertical lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "url(/images/grid-vertical.svg)",
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
            transform: "rotate(90deg)",
            transformOrigin: "center",
          }}
        />
      </div>

      <div className="relative z-10 flex w-full max-w-[1440px] flex-col items-center px-8 py-20">
        {/* Badge */}
        <div className="relative mb-16 flex h-[39px] w-[194px] items-center justify-center rounded-full border border-solid border-secondary">
          <div className="absolute left-[18px] top-[13px] size-[10px]">
            <div className="size-full rounded-full bg-status-green-300" />
          </div>
          <span className="ml-[23px] font-swiss text-base capitalize tracking-tight text-primary">Powered by USD.AI</span>
        </div>

        {/* Main Heading */}
        <h1 className="mb-8 max-w-[813px] text-center font-eiko text-[87px] font-normal leading-[1.02] tracking-tight text-black">
          Turn Compute{" "}
          <br />
          into{" "}
          <span
            className="font-eiko italic"
            style={{
              background: "linear-gradient(to right, #a99482, #433b34)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Capital
          </span>
        </h1>

        {/* Subtitle */}
        <p className="mb-12 max-w-[739px] text-center font-museum text-[18.336px] font-light leading-[1.3] text-[#4d4d4d]">
          Get fast, flexible loans using your AI-grade GPUs as collateral. No credit checks, competitive rates, and
          funds in as little as 24 hours.
        </p>

        {/* CTA Button */}
        <Link href="/contact" className="mb-[-60px] flex h-[55px] w-[235px] items-center justify-center bg-secondary hover:bg-[#C4AD9A] transition-colors">
          <span className="font-swiss text-[22px] tracking-tight text-white">Get a Quote</span>
        </Link>
      </div>
    </div>
  );
}
