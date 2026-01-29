import { SVGProps } from "react";

export function WhaleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Whale body */}
      <path d="M3 12c0-3 2-6 6-7 2-.5 5-.5 7 0 3 1 5 3 5 5s-1 4-4 5c-2 1-5 1.5-8 1-2-.3-4-1-5-2.5-.5-1-.5-2-.5-2.5z" />
      {/* Tail */}
      <path d="M3 12c-1-1-2-2-2-3s1-2 2-2" />
      {/* Eye */}
      <circle cx="16" cy="10" r="1" fill="currentColor" />
      {/* Water spout */}
      <path d="M18 5c0-1.5.5-3 1.5-4M20 5c0-1 .5-2 1-3" />
    </svg>
  );
}
