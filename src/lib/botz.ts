import { Emitter } from './emitter';

export type Message = {
  author: 'user' | 'bot';
  body: string;
  date: Date;
  variant: 'message' | 'error';
};

const process = Symbol();

type BotzEvents = {
  [process]: string;
  message: Message;
  question: string;
  answer: string | undefined;
};

export class Botz extends Emitter<BotzEvents> {
  private message(
    author: Message['author'],
    body: Message['body'],
    variant: Message['variant'] = 'message'
  ) {
    this.emit('message', { author, body, date: new Date(), variant });
  }

  ask(
    message: string,
    options: {
      timeout?: number;
      validate?: (message: string) => Promise<boolean> | boolean;
    } = {}
  ) {
    let resolve: (value: string) => void;
    let timeout: NodeJS.Timeout;

    const promise = new Promise<string>((r) => {
      resolve = r;
    });

    const handle = async (message: string) => {
      const valid = await options.validate?.(message);
      console.log('valid', valid);
      if (valid === false) return;
      console.log('resolve', message);
      resolve(message);
    };

    if (options?.timeout) {
      timeout = setTimeout(() => resolve(''), options.timeout);
    }

    // stop listening, and return value
    promise.then((value) => {
      clearTimeout(timeout);
      this.off(process, handle);
      this.emit('answer', value);
      return value;
    });

    this.on(process, handle);
    this.emit('question', message);
    return promise;
  }

  parse(message: string) {
    this.message('user', message);
    this.emit(process, message);
  }

  think(duration = 1000) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  }

  async say(message: string, options: { delay?: number } = {}) {
    await this.think(options.delay ?? 1000);
    this.message('bot', message);
  }

  alert(message: string) {
    this.message('bot', message, 'error');
  }
}
