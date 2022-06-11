import { ChatFn, FloatingWidget } from './index';

const meta = {
  title: 'Botz',
  component: FloatingWidget,
};

export default meta;

async function createSupportTicket({ name, email, message }: any) {
  const ticket = {
    id: Math.random().toString(36).substr(2, 8),
    name,
    email,
    message,
  };

  if (message === 'throw') throw new Error('hmmm');

  return ticket;
}

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

  try {
    const ticket = await createSupportTicket(data);
    await bot.say(
      `Done! your ticket number is #${ticket.id}. Our human staff will contact you soon. Thanks again!`
    );
  } catch (e) {
    await bot.alert(
      `Sorry, something went wrong! Your message has not been sent.`
    );
  }
};

export const Basic = () => <FloatingWidget chat={chat} isOpen />;
