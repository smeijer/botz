import React, { HTMLAttributes } from 'react';

export function ChatBubbleIcon(props: HTMLAttributes<SVGElement>) {
  return (
    <svg
      fill="none"
      width="32px"
      height="32px"
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
        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
      />
    </svg>
  );
}
