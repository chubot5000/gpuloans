"use client";

export function NewStatisticsSection() {
  const stats = [
    {
      value: "$50M+",
      label: "Loans funded",
    },
    {
      value: "5,000+",
      label: "GPUs Collateralized",
    },
    {
      value: "7.0%",
      label: "Interest Rate",
    },
    {
      value: "$600M",
      label: "Available Capital",
    },
  ];

  return (
    <div className="grid w-full max-w-[1200px] grid-cols-1 gap-4 px-8 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex h-[120px] flex-col items-center justify-center border border-solid border-stone-300 bg-white"
        >
          <p className="font-eiko text-[50px] font-light leading-[1.3] text-stone-700">{stat.value}</p>
          <p className="mt-2 font-museum text-base font-light leading-[1.3] text-stone-700">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
