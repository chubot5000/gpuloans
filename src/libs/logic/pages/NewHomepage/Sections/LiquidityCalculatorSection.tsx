"use client";

import Link from "next/link";
import { useState } from "react";

export function LiquidityCalculatorSection() {
  const [quantity, setQuantity] = useState(8);
  const unitPrice = 15000; // Example price per H100
  const ltvRatio = 0.7;
  const totalValue = quantity * unitPrice;
  const maxLoan = totalValue * ltvRatio;

  const features = [
    "Up to 70% loan-to-value on enterprise GPUs",
    "Competitive interest rates from 8.9% APR",
    "Flexible repayment terms from 3-24 months",
  ];

  return (
    <div className="w-full bg-bg-primary py-20">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-8 lg:grid-cols-2">
        {/* Left Content */}
        <div className="flex flex-col justify-center">
          <h2 className="mb-8 font-eiko text-[60px] font-normal leading-[1.13] tracking-tight text-black">
            Liquidity Calculator
          </h2>

          <p className="mb-8 font-museum text-lg font-light leading-relaxed text-text-secondary">
            Estimate your borrowing power based on current market rates. Our LTV models are updated weekly based on
            secondary market hardware values.
          </p>

          {/* Features List */}
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Icon */}
                <div className="flex size-[32px] shrink-0 items-center justify-center bg-brown-100">
                  <svg className="size-[14px] text-secondary" fill="currentColor" viewBox="0 0 14 14">
                    <path d="M7 0a7 7 0 100 14A7 7 0 007 0zm3 8H8v3H6V8H4V6h2V3h2v3h2v2z" />
                  </svg>
                </div>
                <p className="font-museum text-lg font-light leading-relaxed text-text-secondary">{feature}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Calculator Card */}
        <div className="flex flex-col border border-solid border-stone-300 bg-white p-8">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <p className="font-museum text-[22px] uppercase text-stone-400">ESTIMATE FUNDING</p>

            {/* Live Market Data Badge */}
            <div className="flex h-[19px] items-center gap-2 rounded-full bg-status-green-50 px-3">
              <div className="size-[6px] rounded-full bg-status-green-300" />
              <span className="font-swiss text-[10px] uppercase tracking-tight text-status-green-500">
                Live Market Data
              </span>
            </div>
          </div>

          <div className="mb-6 h-px bg-stone-100" />

          {/* Hardware Model */}
          <div className="mb-6">
            <label className="mb-2 block font-museum text-base font-light text-stone-400">Hardware Model</label>
            <div className="flex h-[55px] items-center rounded-md border border-solid border-stone-300 bg-bg-primary px-4">
              <span className="font-museum text-base font-light text-text-primary">NVIDIA H100 (80GB)</span>
            </div>
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="mb-2 block font-museum text-base font-light text-stone-400">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="flex h-[55px] w-full items-center rounded-md border border-solid border-stone-300 bg-bg-primary px-4 font-museum text-base font-light text-text-primary outline-none"
            />
          </div>

          {/* Results Section */}
          <div className="mb-4 space-y-3">
            {/* Total Collateral Value */}
            <div className="flex items-center justify-between">
              <span className="font-museum text-base font-light text-stone-400">Total Collateral Value</span>
              <span className="font-museum text-base font-light text-text-primary">${totalValue.toLocaleString()}</span>
            </div>

            {/* LTV Ratio */}
            <div className="flex items-center justify-between">
              <span className="font-museum text-base font-light text-stone-400">LTV Ratio</span>
              <span className="font-museum text-base font-light text-text-primary">{(ltvRatio * 100).toFixed(0)}%</span>
            </div>
          </div>

          <div className="my-4 h-px bg-stone-100" />

          {/* Maximum Loan */}
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <span className="font-museum text-[22px] text-text-primary">Maximum Loan</span>
              <span className="font-museum text-[22px] text-status-green-500">${maxLoan.toLocaleString()}</span>
            </div>

            {/* Disclaimer */}
            <p className="mt-3 font-museum text-sm font-light leading-relaxed text-stone-400">
              Final loan amount depends on GPU condition and verification. This is an estimate only.
            </p>
          </div>

          {/* Apply Button */}
          <Link
            href="/contact"
            className="mt-4 flex h-[55px] items-center justify-center bg-secondary hover:bg-[#C4AD9A] transition-colors"
          >
            <span className="font-swiss text-[22px] tracking-tight text-white">Apply for this Loan</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
