import { render } from '@testing-library/react';
import { ClockButton } from '../../../app/components/clock/clock-button';
test('renders clock button', () => {
  render(<ClockButton currentStatus="out" />);
});
