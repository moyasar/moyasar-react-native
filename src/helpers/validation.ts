import type { FieldValidator } from '../services/validators/field_validator';

/**
 * @returns {boolean} True if the field is valid.
 */
export function validateField(
  field: string,
  validator: FieldValidator
): boolean {
  return validator.validate(field) === null;
}
