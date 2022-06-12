import { useEffect, useState } from 'react';
import { Botz } from '../lib/botz';

export type ChatFn = (bot: Botz) => Promise<void>;

export type BotzStatus = 'idle' | 'busy' | 'gone';

export function useBotz(chat: ChatFn): [Botz, BotzStatus] {
  const [bot] = useState(() => new Botz());
  const [status, setStatus] = useState<BotzStatus>('busy');

  useEffect(() => {
    bot.on('question', () => setStatus('idle'));
    bot.on('answer', () => setStatus('busy'));

    // start the chat
    chat(bot)
      .catch((e) => {
        if (__DEV__) {
          console.error('Your chat thew an error');
        }

        throw e;
      })
      .finally(() => {
        setStatus('gone');
      });
  }, [bot, chat]);

  return [bot, status];
}
