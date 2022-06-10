import React, { HTMLAttributes } from 'react';

export function ChevronDownIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      viewBox="0 0 16 14"
      width="16"
      height="25"
      focusable="false"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M.116 4.884l1.768-1.768L8 9.232l6.116-6.116 1.768 1.768L8 12.768.116 4.884z"
      />
    </svg>
  );
}
