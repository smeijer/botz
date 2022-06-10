import { Botz } from './index';
import { FlowEvent } from './hooks/use-chat-bot';

export default {
  title: 'Botz',
  component: Botz,
};

async function createSupportTicket({ name, email, message }: any) {
  const ticket = {
    id: Math.random().toString(36).substr(2, 8),
    name,
    email,
    message,
  };

  return { ticket, error: '' };
}

const chatFlow: FlowEvent[] = [
  { field: 'message', placeholder: 'Write a message…' },
  {
    field: 'name',
    placeholder: 'Please enter your name…',
    enter: async ({ say }) => {
      await say(
        'Hi! Thank you for your message. Can you answer a few questions for me, so we can help you?'
      );
      await say("Let's start with your name. How should we call you?");
    },
  },
  {
    field: 'email',
    placeholder: 'Please enter your email…',
    enter: async ({ values: { name }, say }) => {
      await say(`Thanks, ${name}! At what email address can we reach you?`);
    },
    validate: async (message, { say }) => {
      if (/^.+@.+\.+.+$/.test(message)) return true;

      await say(
        'Sorry, this does not look like a proper email address. Wanna try again?'
      );
      return false;
    },
  },
  {
    enter: ({ say }) =>
      say("Awesome! I'll forward this to our support staff. One sec."),
    action: async ({ values, say }) => {
      const { error, ticket } = await createSupportTicket(values);
      if (/Too Many Requests/i.test(error)) {
        await say(
          `Sorry, we've received a bunch of support requests from your IP address in a very short time. Please try again later.`,
          { variant: 'error' }
        );
      } else if (error) {
        await say(`Sorry, something went wrong!`);
        await say(error, { variant: 'error' });
      } else {
        await say(`Done! Your ticket number is #${ticket.id}.`);
        await say(`Our human staff will contact you soon. Thanks again!`);
      }
    },
  },
];

export const Basic = () => <Botz flow={chatFlow} isOpen />;
