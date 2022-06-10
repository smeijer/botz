import { useState, useCallback, useRef } from 'react';

interface Context {
  say: (
    message: string,
    options?: { delay?: number; variant?: Message['variant'] }
  ) => Promise<void>;
  values: Record<string, string>;
}

export interface FlowEvent {
  field?: string;
  placeholder?: string;
  enter?: (context: Context) => Promise<void>;
  action?: (context: Context) => Promise<boolean | void>;
  validate?: (message: string, content: Context) => Promise<boolean | void>;
}

interface useChatBotOptions {
  flow: FlowEvent[];
}

export interface Message {
  author: 'bot' | 'user';
  body: string;
  variant?: 'text' | 'error';
}

export function useChatBot({ flow }: useChatBotOptions) {
  const [status, setStatus] = useState('idle');
  const flowRef = useRef([...flow]);
  const valueRef = useRef<Record<string, string>>({});
  const [messages, setMessages] = useState<Message[]>([]);

  const echo = (body: string) =>
    setMessages((current) => [...current, { author: 'user', body }]);

  const say: Context['say'] = async (body, options = {}) =>
    new Promise<void>((resolve) =>
      setTimeout(() => {
        setMessages((current) => [
          ...current,
          { author: 'bot', body, variant: options.variant },
        ]);
        resolve();
      }, options.delay ?? 1000)
    );

  const addMessage = useCallback(
    async (value: string) => {
      if (!value.trim().length) return;
      if (status !== 'idle' || !flowRef.current.length) return;

      echo(value);
      const values = valueRef.current;

      try {
        setStatus('busy');
        while (true) {
          const [{ field, validate, action }] = flowRef.current;

          // validate input
          if (typeof validate === 'function') {
            const ok = await validate(value, { say, values });
            if (ok === false) break;
          }

          // value is validated, so update current state
          if (typeof field === 'string') {
            values[field] = value;
          }

          // execute action
          if (typeof action === 'function') {
            const ok = await action({ say, values });
            if (ok === false) break;
          }

          // this step was handled, remove it from the queue
          flowRef.current.shift();

          if (!flowRef.current.length) break;
          const [{ enter, field: nextField }] = flowRef.current;

          // enter
          if (typeof enter === 'function') {
            await enter({ say, values });
          }

          // fields require human input, break the loop
          if (nextField) break;
        }
      } finally {
        setStatus(flowRef.current.length ? 'idle' : 'done');
      }
    },
    [status]
  );

  const [step] = flowRef.current;

  return {
    messages,
    addMessage,
    status,
    step,
  };
}
