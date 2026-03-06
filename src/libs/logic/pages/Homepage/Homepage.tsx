import { cn } from "logic/utils";

import {
  FaqSection,
  FinancingSection,
  HeroSection,
  SectionWrapper,
  StatisticsSection,
  StepByStepSection,
} from "./Sections";

export function Homepage() {
  return (
    <>
      <section
        className={cn(
          "relative flex-col w-full flex items-center justify-center",
          "h-fit md:h-[calc(100vh-var(--nav-height))] md:min-h-[740px] md:max-h-[870px]",
        )}
      >
        <HeroSection />
      </section>

      <SectionWrapper className="justify-center px-8 py-12 md:py-20">
        <StatisticsSection />
      </SectionWrapper>

      <SectionWrapper
        className="justify-center px-4 py-12 md:px-8 md:py-20"
        style={{ backgroundImage: `url(/images/grid.png)`, backgroundRepeat: "repeat-x" }}
      >
        <FinancingSection />
      </SectionWrapper>

      <SectionWrapper className="px-8 py-12 bg-brown-900 md:py-20">
        <StepByStepSection />
      </SectionWrapper>

      <SectionWrapper className="px-4 py-24 md:px-8 md:py-28">
        <FaqSection />
      </SectionWrapper>
    </>
  );
}
