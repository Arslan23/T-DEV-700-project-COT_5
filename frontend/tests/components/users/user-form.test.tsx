// User form component test
import { render } from '@testing-library/react';
import UserForm from '../../../app/components/users/user-form';
test('renders user form', () => {
  render(<UserForm />);
});
