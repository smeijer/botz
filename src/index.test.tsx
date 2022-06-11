import { Basic as Botz } from './index.stories';
import { render } from '@testing-library/react';

test('renders without crashing', () => {
  render(<Botz />);
});
