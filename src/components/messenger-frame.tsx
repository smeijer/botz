import { useIsVisible } from '../hooks/use-is-visible';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TimesIcon } from './icons/times-icon';
import { Composer } from './composer';
import { Botz, Message } from '../lib/botz';
import { BotzStatus } from '../hooks/use-botz';

interface MessageProps extends Message {}

function MessageBubble({ author, body, variant }: MessageProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = ref.current;
    if (!target) return;

    requestAnimationFrame(() => {
      target.parentElement!.dataset.visible = 'true';
    });
  }, [ref]);

  return (
    <div
      className="botz-message-bubble"
      data-align={author === 'bot' ? 'right' : 'left'}
      data-variant={variant}
    >
      <div ref={ref}>{body}</div>
    </div>
  );
}

interface MessengerFrameProps {
  isOpen?: boolean;
  close?: () => void;
  logo?: ReactNode;
  bot: Botz;
  status: BotzStatus;
}

export function MessengerFrame({
  isOpen,
  close,
  bot,
  logo,
  status,
}: MessengerFrameProps) {
  const isVisible = useIsVisible({ open: isOpen, timeout: 3000 });
  const scrollable = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<MessageProps[]>([]);
  const [placeholder, setPlaceholder] = useState('Send a message…');

  useEffect(() => {
    bot.on('message', (message) => {
      setMessages((c) => [...c, message]);
    });

    bot.on('question', (question) => {
      setPlaceholder(question);
    });
  }, [bot]);

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

  const handleMessage = useCallback(
    (message: string) => {
      if (message.trim().length === 0) return;
      bot.parse(message);
    },
    [bot]
  );

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

          <div data-visible={status !== 'gone'} className="botz-composer">
            <Composer
              disabled={status !== 'idle'}
              placeholder={placeholder}
              onSubmit={handleMessage}
            />
          </div>
        </>
      ) : null}
    </div>
  );
}
