import { cn } from "logic/utils";

const steps = [
  {
    title: "Consult",
    description: "Talk with our team of GPU finance experts to understand your needs and goals.",
  },
  {
    title: "Customize",
    description: "We assess a tailored loan plan built around your hardware, budget, and timeline.",
  },
  {
    title: "Finance",
    description: "Get quick approval and deploy capital with transparent terms and zero hassle.",
  },
  {
    title: "Scale",
    description: "Expand your compute capacity and grow your AI operations with confidence.",
  },
];

export function StepByStepSection() {
  return (
    <div className="flex flex-col gap-20 justify-center items-center w-full h-full text-center md:gap-32 max-w-9xl">
      <div className="flex flex-col gap-9">
        <span className="text-xl font-light text-center md:text-2xl text-bg-page font-polar">Step-by-Step to</span>
        <h2
          className={cn(
            "italic font-light text-center text-bg-page font-eiko tracking-[-1.12px]",
            "text-4xl md:text-6xl",
          )}
        >
          Compute Scaling
        </h2>
      </div>

      <div className="flex flex-col gap-0 w-full max-w-6xl max-md:max-w-lg md:flex-row md:gap-6 lg:gap-8">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-row flex-1 gap-4 md:gap-12 md:flex-col md:last-of-type:max-w-[230px]">
            <div className="flex flex-col gap-2 items-center md:flex-row md:gap-4">
              <span className="text-4xl font-bold font-eiko leading-[48px] tracking-[4px] text-white/20">
                {index + 1 < 10 ? `0${index + 1}` : index + 1}
              </span>
              {index < steps.length - 1 && (
                <div
                  style={{
                    backgroundImage: "linear-gradient(to bottom, #524D48 33%, transparent 0%)",
                    backgroundPosition: "center",
                    backgroundSize: "1px 12px",
                    backgroundRepeat: "repeat-y",
                  }}
                  className="w-px flex-1 min-h-[120px] md:hidden"
                />
              )}
              {index < steps.length - 1 && (
                <div
                  style={{
                    backgroundImage: "linear-gradient(to right, #524D48 33%, transparent 0%)",
                    backgroundPosition: "bottom",
                    backgroundSize: "27px 1px",
                    backgroundRepeat: "repeat-x",
                  }}
                  className="hidden flex-1 h-px md:block"
                />
              )}
            </div>
            <div className="flex flex-col flex-1 gap-12 pb-8 text-left md:max-w-[230px] md:pb-0 md:gap-16">
              <h3 className="text-4xl font-medium text-brown-100 font-eiko">{step.title}</h3>
              <p className="text-sm font-light leading-relaxed md:text-base font-polar text-stone-400">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
