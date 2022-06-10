import React, { HTMLAttributes } from 'react';

export function TimesIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      fill="none"
      width="20px"
      height="20px"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth="2"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
}
