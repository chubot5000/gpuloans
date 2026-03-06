"use client";

export function ThreeStepsSection() {
  const steps = [
    {
      title: "Consult",
      description: "Talk with our team of GPU finance experts to understand your needs and goals.",
    },
    {
      title: "Customize",
      description: "Work with us to design a financing solution tailored to your infrastructure needs.",
    },
    {
      title: "Finance",
      description: "Get approved and funded quickly with our streamlined application process.",
    },
    {
      title: "Scale",
      description: "Use your capital to scale operations and grow your AI infrastructure.",
    },
  ];

  return (
    <div className="w-full max-w-[1440px] px-8 py-20">
      {/* Heading */}
      <h2 className="mb-8 text-center font-eiko text-[60px] font-normal leading-[1.02] tracking-tight text-black">
        Get funded in three simple steps
      </h2>

      {/* Subtitle */}
      <p className="mx-auto mb-16 max-w-[739px] text-center font-museum text-lg font-light leading-relaxed text-text-secondary">
        Our streamlined process makes it easy to unlock the value of your GPU hardware. No complicated paperwork, no
        lengthy approvals.
      </p>

      {/* Step Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col border border-solid border-stone-300 bg-white p-8">
            {/* Icon */}
            <div className="mb-6 flex size-[32px] items-center justify-center bg-secondary">
              <svg className="size-[14px] text-white" fill="currentColor" viewBox="0 0 14 14">
                <path d="M12 1H2a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V2a1 1 0 00-1-1z" />
              </svg>
            </div>

            {/* Title */}
            <h3 className="mb-4 font-museum text-[35px] font-light leading-[1.3] text-stone-700">{step.title}</h3>

            {/* Description */}
            <p className="font-museum text-base font-light leading-[1.3] text-stone-700">{step.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
