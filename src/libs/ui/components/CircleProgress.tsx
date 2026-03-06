"use client";

import { cn } from "logic/utils";

export interface ProgressSegment {
  percentage: number;
  color: string;
}

export interface CircleProgressProps {
  segments: ProgressSegment[];
  value: number;
  label?: string;
  className?: string;
}

const SIZE = 100;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const CENTER = SIZE / 2;

function percentToLength(percent: number): number {
  return (percent / 100) * CIRCUMFERENCE;
}

export function CircleProgress({ segments, value, label = "Complete", className }: CircleProgressProps) {
  let cumulativeLength = 0;
  const segmentsWithOffsets = segments.map((segment, i) => {
    const length = percentToLength(segment.percentage);
    const offset = cumulativeLength;
    cumulativeLength += length;

    return {
      key: i,
      color: segment.color,
      dashArray: `${length} ${CIRCUMFERENCE - length}`,
      dashOffset: -offset,
    };
  });

  return (
    <div className={cn("relative inline-flex items-center justify-center w-full h-full", className)}>
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="absolute w-full h-full -rotate-90">
        {/* Background circle */}
        <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="#EBE9E8" strokeWidth={STROKE_WIDTH} />

        {/* Progress segments */}
        {segmentsWithOffsets.map((seg) => (
          <circle
            key={seg.key}
            cx={CENTER}
            cy={CENTER}
            r={RADIUS}
            fill="none"
            stroke={seg.color}
            strokeWidth={STROKE_WIDTH}
            strokeDasharray={seg.dashArray}
            strokeDashoffset={seg.dashOffset}
          />
        ))}
      </svg>

      {/* Center content */}
      <div className="absolute flex flex-col items-center text-status-green-500">
        <div>
          <span className="font-bold text-[44px] leading-none">{Math.round(value)}</span>
          <span className="font-medium text-[16px] tracking-tight ml-0.5">%</span>
        </div>
        <span className="text-sm mt-1">{label}</span>
      </div>
    </div>
  );
}
