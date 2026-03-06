"use client";

import {
  CtaSection,
  GpuImagesSection,
  LiquidityCalculatorSection,
  NewHeroSection,
  NewNavSection,
  NewStatisticsSection,
  ThreeStepsSection,
} from "./Sections";

export function NewHomepage() {
  return (
    <div className="relative w-full bg-white">
      {/* Navigation - Fixed at top */}
      <NewNavSection />

      {/* Hero Section with Background Grid */}
      <section className="relative">
        <NewHeroSection />
      </section>

      {/* GPU Images Section - decorative */}
      <section className="relative">
        <GpuImagesSection />
      </section>

      {/* Statistics Section */}
      <section className="relative flex w-full items-center justify-center bg-white py-20">
        <NewStatisticsSection />
      </section>

      {/* Three Steps Section */}
      <section className="relative flex w-full items-center justify-center bg-white">
        <ThreeStepsSection />
      </section>

      {/* Liquidity Calculator Section */}
      <section className="relative flex w-full items-center justify-center">
        <LiquidityCalculatorSection />
      </section>

      {/* CTA Section */}
      <section className="relative flex w-full items-center justify-center">
        <CtaSection />
      </section>
    </div>
  );
}
