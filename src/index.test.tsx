import { Default as Botz } from './index.stories';
import { render, screen } from '@testing-library/react';

test('renders without crashing', () => {
  render(<Botz isOpen={true} />);
  screen.getByText('the snozzberries taste like snozzberries');
});
