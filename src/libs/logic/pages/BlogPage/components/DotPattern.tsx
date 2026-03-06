'use client';

import { useId } from 'react';

interface DotPatternProps {
  className?: string;
  dotColor?: string;
  dotSize?: number;
  spacing?: number;
}

export function DotPattern({
  className,
  dotColor = '#E5CBB4',
  dotSize = 44 / 24,
  spacing = 106.48 / 24,
}: DotPatternProps) {
  const patternId = useId();

  return (
    <svg width='100%' height='100%' xmlns='http://www.w3.org/2000/svg' className={className}>
      <defs>
        <pattern id={patternId} patternUnits='userSpaceOnUse' width={spacing} height={spacing * 2}>
          {/* First row */}
          <circle cx={spacing / 2} cy={spacing / 2} r={dotSize / 2} fill={dotColor} />
          {/* Second row - offset */}
          <circle cx={0} cy={spacing * 1.5} r={dotSize / 2} fill={dotColor} />
          <circle cx={spacing} cy={spacing * 1.5} r={dotSize / 2} fill={dotColor} />
        </pattern>
      </defs>
      <rect width='100%' height='100%' fill={`url(#${patternId})`} />
    </svg>
  );
}
