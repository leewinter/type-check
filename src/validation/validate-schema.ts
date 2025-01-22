import { ValidationResult, ValidationSchema } from "./validation-types";
import { Validator } from "./validator";

export function validateSchema(
  schema: ValidationSchema,
  model: Record<string, any>,
): Record<string, ValidationResult> {
  const result: Record<string, ValidationResult> = {};
  for (const field in schema) {
    const validator = schema[field];
    const value = model[field];
    result[field] = validator.validate(value, model);
  }
  return result;
}
