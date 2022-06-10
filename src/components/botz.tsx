import React, { useEffect, useState } from 'react';
import { LauncherButton } from './launcher-button';
import { MessengerFrame } from './messenger-frame';
import { FlowEvent } from '../hooks/use-chat-bot';

type Botz = (cmd: 'open' | 'close' | 'toggle') => void;

declare global {
  interface Window {
    botz?: Botz;
  }
}

export interface BotzProps {
  isOpen?: boolean;
  flow: FlowEvent[];
}

export function Botz({ isOpen: initialOpen = false, flow }: BotzProps) {
  const [isOpen, setIsOpen] = useState(initialOpen);

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
        flow={flow}
      />
    </div>
  );
}
