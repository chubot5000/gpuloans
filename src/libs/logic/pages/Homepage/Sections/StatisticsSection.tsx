"use client";

import { cn } from "logic/utils";
import Image from "next/image";
import { Fragment } from "react";

export function StatisticsSection() {
  return (
    <div className="flex flex-col gap-6 justify-center items-center w-full h-full max-w-9xl xl:gap-12 lg:flex-row">
      <div className="flex flex-col gap-6 justify-center w-full h-full lg:w-1/2">
        <h2 className="text-text-primary font-eiko text-4xl font-medium italic leading-[1.5] tracking-[-0.54px]">
          Capital for the Compute Era
        </h2>

        <span className="text-primary text-base font-light leading-[1.8] max-w-xl">
          Unlock fast, flexible capital for your GPU cluster, tailored specifically for AI HPC use cases. As trusted
          experts in GPU capital, we make it simple to unlock hardware funding without the friction.
        </span>

        <Statistics />
      </div>
      <Image
        src="/images/gpu_farm.jpg"
        alt="GPU Farm"
        width={829}
        height={580}
        className="object-cover relative w-screen md:h-96 lg:h-full max-h-[38rem] lg:-mr-10 lg:w-1/2"
      />
    </div>
  );
}

function Statistics() {
  const STATS_DATA = [
    { prefix: "As low as", value: "7.0%", label: "Interest Rate" },
    { prefix: "More than", value: "$ 600m", label: "Available Capital" },
    { prefix: "Up to", value: "6x", label: "Scalability" },
  ];

  return (
    <div className={cn("relative w-full py-6 md:py-8 flex flex-row gap-4 md:gap-10")}>
      {STATS_DATA.map(({ value, label, prefix }, index) => (
        <Fragment key={label}>
          <div key={label} className="flex flex-col flex-1 gap-2 items-start w-44 max-md:max-w-32">
            <span className="text-[#58493D] font-medium text-sm md:text-base font-eiko leading-[1.18539] tracking-[-0.32px]">
              {prefix}
            </span>
            <span
              className={cn(
                "text-[#58493D] font-eiko font-bold leading-[1.18539] tracking-[-0.96px]",
                "text-2xl md:text-4xl whitespace-nowrap",
              )}
            >
              {value}
            </span>
            <span className="text-[#85746E] text-sm md:text-base font-light leading-[1.5] tracking-[-0.24px]">
              {label}
            </span>
          </div>
          {index < STATS_DATA.length - 1 && <div className="border-l border-[#E1DFDE] self-stretch" />}
        </Fragment>
      ))}
    </div>
  );
}
