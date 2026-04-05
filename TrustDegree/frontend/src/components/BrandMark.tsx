import { useId } from "react";

type BrandMarkProps = {
  className?: string;
};

export default function BrandMark({ className }: BrandMarkProps) {
  const rawId = useId();
  const gradientId = `${rawId.replace(/:/g, "-")}-gradient`;

  return (
    <svg
      viewBox="0 0 48 48"
      role="img"
      aria-label="TrustDegree logo"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>TrustDegree logo</title>
      <defs>
        <linearGradient id={gradientId} x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0EA5E9" />
          <stop offset="1" stopColor="#0C4A6E" />
        </linearGradient>
      </defs>

      <rect x="4" y="4" width="40" height="40" rx="12" fill={`url(#${gradientId})`} />
      <path
        d="M14 18H34M18 18V31.5C18 33.5 19.7 35 21.7 35H26.3C28.3 35 30 33.5 30 31.5V18"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M24 22V31"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="24" cy="14" r="2.2" fill="#FDE68A" />
    </svg>
  );
}
