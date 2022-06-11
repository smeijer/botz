import { ChatBubbleIcon } from './icons/chat-bubble-icon';
import { ChevronDownIcon } from './icons/chevron-down-icon';

import React from 'react';

interface LauncherButtonProps {
  isOpen?: boolean;
  toggle?: () => void;
}

export function LauncherButton({ isOpen, toggle }: LauncherButtonProps) {
  return (
    <button
      className="botz-launcher-button"
      data-open={isOpen}
      aria-label={isOpen ? 'Close chat' : 'Open chat'}
      onClick={toggle}
      type="button"
    >
      <ChatBubbleIcon />
      <ChevronDownIcon />
    </button>
  );
}

export default LauncherButton;
