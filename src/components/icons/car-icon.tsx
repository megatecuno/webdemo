import * as React from "react";
import { SVGProps } from "react";

export const CarIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M14 16H9m10-5.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M5 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
    <path d="M19 11h-3.5a1 1 0 0 1-1-1V8.5a1 1 0 0 0-1-1h-3a1 1 0 0 0-1 1V10a1 1 0 0 1-1 1H5l-2.88 4.6a1 1 0 0 0 .8 1.54h18.16a1 1 0 0 0 .8-1.54L19 11Z" />
  </svg>
);
