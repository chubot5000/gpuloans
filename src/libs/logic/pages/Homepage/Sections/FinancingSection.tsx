"use client";

import { cn } from "logic/utils";
import Image from "next/image";
import Link from "next/link";
import { Button } from "ui/components";

export function FinancingSection() {
  return (
    <div className="flex flex-col gap-8 justify-center items-center w-full h-full text-center md:gap-16 max-w-9xl">
      <h2 className="text-text-primary font-eiko text-3xl md:text-4xl font-medium italic leading-[1.5] tracking-[-0.54px]">
        We finance most GPU hardware at scale
      </h2>

      <div className="flex z-10 flex-col gap-7 max-w-6xl md:gap-16 lg:flex-row xl:gap-22">
        <div
          className={cn(
            "flex flex-col gap-12 justify-center items-center px-6 py-8 md:px-10 bg-brown-900",
            "max-md:h-[543px] max-md:w-[361px] max-w-[484px]",
          )}
        >
          <div className="relative my-auto">
            <div
              className={cn(
                "absolute top-1/2 left-1/2 w-28 h-28 bg-white rounded-full transform -translate-x-1/2",
                "-translate-y-1/2 z-0 blur-3xl",
              )}
            />
            <Image
              src="/images/B300.png"
              alt="NVIDIA B300"
              width={220}
              height={180}
              quality={70}
              sizes="(max-width: 768px) 176px, 208px"
              className="relative z-10 w-44 md:w-52"
            />
          </div>

          <h3 className="font-eiko text-white text-2xl font-medium tracking-[-0.56px] mt-auto">NVIDIA B300</h3>

          <span className="font-polar text-base text-[#A7A5A4] leading-[1.5] tracking-[-0.32px] text-center">
            The NVIDIA B300 is a purpose-built AI infrastructure solution tailored to meet the computational demands of
            generative AI.
          </span>

          <Button as={Link} href="/contact" className="w-full btn-secondary">
            Get a Quote
          </Button>
        </div>

        <div
          className={cn(
            "flex flex-col gap-12 justify-center items-center px-6 py-8 max-w-[484px] md:px-10 border border-primary",
            "max-md:h-[543px] max-md:w-[361px] bg-white",
          )}
        >
          <Image
            src="/images/RTX6000.png"
            alt="RTX6000"
            width={321}
            height={241}
            quality={70}
            sizes="(max-width: 768px) 213px, 320px"
            className="w-auto h-40 md:h-60"
          />

          <h3 className="font-eiko text-text-primary text-2xl font-medium tracking-[-0.56px] mt-auto">
            NVIDIA RTX PRO™ 6000 Blackwell
          </h3>

          <span className="font-polar text-base text-outline-major leading-[1.5] tracking-[-0.32px]">
            The NVIDIA RTX PRO™ 6000 Blackwell is the most powerful desktop GPU ever created, redefining performance
            and capability for professionals.
          </span>

          <Button as={Link} href="/contact" className="w-full btn-primary">
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
}
