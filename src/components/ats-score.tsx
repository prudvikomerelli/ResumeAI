"use client";

import { cn } from "@/lib/utils";

interface AtsScoreProps {
  score: number;
  size?: "sm" | "lg";
}

export function AtsScore({ score, size = "lg" }: AtsScoreProps) {
  const radius = size === "lg" ? 60 : 36;
  const stroke = size === "lg" ? 8 : 5;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const svgSize = (radius + stroke) * 2;

  const color =
    score >= 80
      ? "text-green-500"
      : score >= 60
        ? "text-yellow-500"
        : "text-red-500";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={svgSize} height={svgSize} className="-rotate-90">
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx={radius + stroke}
          cy={radius + stroke}
          r={radius}
          stroke="currentColor"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000", color)}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className={cn("font-bold", size === "lg" ? "text-3xl" : "text-lg")}>
          {score}
        </span>
        <span className={cn("text-gray-500", size === "lg" ? "text-sm" : "text-xs")}>
          ATS Score
        </span>
      </div>
    </div>
  );
}
