import React, { ReactNode, useEffect, useState } from 'react';
import { LauncherButton } from './launcher-button';
import { MessengerFrame } from './messenger-frame';
import { ChatFn, useBotz } from '../hooks/use-botz';

type WindowControls = (cmd: 'open' | 'close' | 'toggle') => void;

declare global {
  interface Window {
    botz?: WindowControls;
  }
}

export interface FloatingWidgetProps {
  isOpen?: boolean;
  logo?: ReactNode;
  chat: ChatFn;
}

export function FloatingWidget({
  isOpen: initialOpen = false,
  logo,
  chat,
}: FloatingWidgetProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);
  const [bot, status] = useBotz(chat);

  useEffect(() => {
    if (typeof window === 'undefined' || window.botz) return;

    window.botz = (cmd) => {
      if (cmd === 'open') setIsOpen(true);
      if (cmd === 'close') setIsOpen(false);
      if (cmd === 'toggle') setIsOpen((c) => !c);
    };

    return () => void delete window.botz;
  }, [setIsOpen]);

  return (
    <div className="botz-root">
      <LauncherButton isOpen={isOpen} toggle={() => setIsOpen((c) => !c)} />
      <MessengerFrame
        isOpen={isOpen}
        close={() => setIsOpen(false)}
        bot={bot}
        status={status}
        logo={logo}
      />
    </div>
  );
}
