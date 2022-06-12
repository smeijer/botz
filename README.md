# Botz

A react widget like the intercom chat, but driven by your chat lines, and easy to connect to your own backend.

## Usage

```tsx
import { FloatingWidget, ChatFn } from 'botz';
import 'botz/styles.css';

const chat: ChatFn = async (bot) => {
  await bot.say(`Hi! Please enter your email to subscribe.`);

  const email = await bot.ask(`What's your email?`, {
    validate: async (value) => {
      if (/^.+@.+\.+.+$/.test(value)) return true;
      await bot.say(
        'Sorry, this does not look like a proper email address. Wanna try again?'
      );
      return false;
    },
  });

  await fetch('https://example.com/signup', { method: 'POST', body: email });
  await bot.say(`Sweet! You're signed up!`);
};

const App = () => {
  return (
    <div>
      <FloatingWidget chat={chat} />
    </div>
  );
};
```
