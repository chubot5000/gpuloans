"use client";

import Image from "next/image";

export function GpuImagesSection() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-hidden bg-white py-8">
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

      <Image
        src="/images/gpus.png"
        alt="GPU Hardware"
        width={730}
        height={428}
        className="relative z-10 h-auto w-full max-w-[730px] px-4"
        priority={false}
      />
    </div>
  );
}
