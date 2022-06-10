import { useIsVisible } from '../hooks/use-is-visible';
import { FlowEvent, Message, useChatBot } from '../hooks/use-chat-bot';
import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { TimesIcon } from '../icons/times-icon';

import { animate, spring } from 'motion';
import { mix } from '@motionone/utils';
import { Composer } from './composer';

const messageStyle = {
  transform: `translateY(-50px)`,
  opacity: 0,
};

interface MessageProps extends Message {}

function MessageBubble({ author, body, variant }: MessageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    animate(
      (progress) => {
        const y = Math.abs(0 - mix(8, 0, progress));
        target.style.transform = `translateY(${y}px)`;
        target.style.opacity = String(mix(0, 1, progress));
      },
      { duration: 0.5, easing: spring() }
    );
  }, [ref]);

  return (
    <div
      className="botz-message-bubble"
      data-align={author === 'bot' ? 'right' : 'left'}
      data-variant={variant}
    >
      <div ref={ref} style={messageStyle}>
        {body}
      </div>
    </div>
  );
}

interface MessengerFrameProps {
  isOpen?: boolean;
  close?: () => void;
  flow: FlowEvent[];
  logo?: ReactNode;
}

export function MessengerFrame({
  isOpen,
  close,
  flow,
  logo,
}: MessengerFrameProps) {
  const isVisible = useIsVisible({ open: isOpen, timeout: 3000 });
  const { messages, addMessage, status, step } = useChatBot({ flow });
  const scrollable = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = scrollable.current;
    if (!target) return;
    requestAnimationFrame(() =>
      target.scrollTo({
        top: target.scrollHeight,
        behavior: 'smooth',
      })
    );
  }, [messages.length, scrollable, isVisible]);

  const placeholder =
    status === 'busy' ? '…' : step?.placeholder || 'Send a message…';

  return (
    <div data-open={isOpen} className="botz-messenger-frame">
      {isVisible ? (
        <>
          <div className="botz-messenger-frame-header">
            {logo || (
              <div className="botz-logo">Hi! 👋 Shoot us a message!</div>
            )}

            <button
              aria-label="Close chat"
              className="botz-close-button"
              type="button"
              onClick={close}
            >
              <TimesIcon />
            </button>
          </div>

          <div className="botz-conversation" ref={scrollable}>
            {messages.map((message, idx) => (
              <MessageBubble key={idx} {...message} />
            ))}
          </div>

          <div data-visible={status !== 'done'} className="botz-composer">
            <Composer
              disabled={status !== 'idle'}
              placeholder={placeholder}
              onSubmit={addMessage}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
