import { render } from '@testing-library/react';
import LandingPage from '../../app/routes/landingpage';
test('renders login page', () => {
  render(<LandingPage />);
});
