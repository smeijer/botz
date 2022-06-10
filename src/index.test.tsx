import { Default as Thing } from './index.stories';
import { render, screen } from '@testing-library/react';

test('renders without crashing', () => {
  render(<Thing />);
  screen.getByText('the snozzberries taste like snozzberries');
});
