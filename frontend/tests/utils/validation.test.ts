// Validation utility test
import { validateForm } from '../../app/utils/validation';
test('validateForm returns true', () => {
  expect(validateForm({})).toBe(true);
});
