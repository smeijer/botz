import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ChatFn, FloatingWidget } from '../src';
import '../styles.css';

const chat: ChatFn = async (bot) => {
  const data = { name: '', email: '', message: '' };

  await bot.say(
    'Hi! Thanks for reaching out. Before we get started, can you please tell me your name?'
  );

  data.name = await bot.ask(`How should we call you?`, {
    validate: async (value) => value.trim().length > 0,
  });

  await bot.say(
    `Thanks, ${data.name}! At what email address can we reach you?`
  );

  data.email = await bot.ask(`What's your email?`, {
    validate: async (value) => {
      if (/^.+@.+\.+.+$/.test(value)) return true;

      await bot.say(
        'Sorry, this does not look like a proper email address. Wanna try again?'
      );

      return false;
    },
  });

  await bot.say(`Sweet! So… what can we help you with?`);
  data.message = await bot.ask(`Write a message…`, {
    validate: (value) => {
      return value.trim().length > 0;
    },
  });

  await bot.say(`Awesome! I'll forward this to our support staff. One sec.`);
};

const App = () => {
  return (
    <div>
      <FloatingWidget chat={chat} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
