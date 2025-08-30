import * as React from "react";
import { SVGProps } from "react";

export const CustomBotIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    {/* Antenna */}
    <path d="M12 8V4h4" />
    {/* Head */}
    <rect x={4} y={8} width={16} height={12} rx={2} />
    {/* Left Eye */}
    <path d="M9 14v-2" />
    {/* Right Eye (wink) */}
    <path d="M14 13h2" />
    {/* Ears */}
    <path d="M4 12H2.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5H4" />
    <path d="M20 12h1.5a.5.5 0 0 1 .5.5v3a.5.5 0 0 1-.5.5H20" />
  </svg>
);
