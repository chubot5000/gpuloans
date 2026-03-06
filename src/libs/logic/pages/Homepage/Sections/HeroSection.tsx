import { cn } from "logic/utils";
import Image from "next/image";

import { QuoteSimulator } from "../components/QuoteSimulator";

export function HeroSection() {
  return (
    <>
      <Image
        src="/images/bg.jpg"
        alt="GPU Loans"
        fill
        priority
        fetchPriority="high"
        quality={45}
        sizes="100vw"
        className="absolute top-0 left-0 w-full h-[75%] md:h-[85%] object-cover -z-[1]"
      />
      <div
        className="absolute top-[75%] md:top-[85%] left-0 w-full -z-[1] h-screen md:h-[calc(75vh-54px)]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(0, 0, 0, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 1px, transparent 1px)",
          backgroundSize: "32.73px 32.73px",
          WebkitMaskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.65) 30%, transparent 100%), radial-gradient(ellipse 99% 99% at 50% 0%, #000 99%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, rgba(0, 0, 0, 0.65) 0%, rgba(0, 0, 0, 0.65) 30%, transparent 100%), radial-gradient(ellipse 99% 99% at 50% 0%, #000 99%, transparent 100%)",
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      />
      <div
        className={cn(
          "flex flex-col items-center justify-center text-white w-full md:w-4/5 lg:w-3/5 max-w-12xl",
          "h-[60%] md:h-[70%] px-6 py-10 md:py-14 gap-6 md:gap-4.5",
        )}
      >
        <Image src="/svg/usd-ai-logo.svg" alt="USD.AI" width={100} height={100} className="w-12 md:w-16" />
        <span className="text-sm font-bold tracking-wide uppercase md:text-base">POWERED BY USD.AI</span>
        <h1 className="text-center font-eiko text-4xl leading-[1.1] md:text-7xl font-medium md:mb-3.5">
          GPU-Backed Loans <span className="whitespace-nowrap">for AI Infrastructure</span>
        </h1>
        <span className="block text-base font-light text-center md:text-lg text-[#FFF1E5]">
          Secure GPU-backed credit for AI operators.{" "}
          <span className="whitespace-nowrap">Finance deployed GPUs with powered by USD.AI</span>
        </span>
        <span className="block text-base font-light md:text-center md:text-lg text-[#FFF1E5] md:mt-auto">
          Get a quote now :
        </span>
      </div>
      <div className="flex justify-center p-4 w-full max-w-12xl">
        <QuoteSimulator />
      </div>
    </>
  );
}
