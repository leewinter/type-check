# Validation

Validation has two main functions.

- **validateSchema**
  - This is intended to be called on form submission and will give an overall result for each form field. It will show if the field value is valid, and if not an array of validation messages will be provided.
- **evaluateSchema**
  - This will perform the same functionality as validateSchema, however the result will be an object with a property for every field in the schema. Each field property will have a property for all validation rules regardless of if they were provided in the schema (if not provided the value will be null). If a rule was provided in the schema a valid boolean will be provided, along with any parameters for the rule. The intention is this result can be used to populate component level attributes such as required, maxLength, etc.

## validateSchema

Validates a data model against a provided schema and returns a detailed result for each field.

---

### validateSchema Parameters

- **`schema`**: `ValidationSchema`  
  An object where each key is a field name and each value is a `Validator` instance that defines validation rules for that field.

- **`model`**: `Record<string, unknown>`  
  The data model containing field values to validate.

---

### validateSchema Returns

- **`Record<string, ValidationResult>`**:  
  A mapping of field names to their validation results. Each `ValidationResult` contains detailed information about the validation outcome for that field. It's intended to give an overall result for each field if valid or not.

---

### Validation Flow

1. Each field in the schema is validated against the corresponding value in the model using the `Validator` instance's `validate` method.
2. The result for each field is stored in the output object, keyed by the field name.
3. Fields present in the schema but not in the model will be evaluated with `undefined` as their value.

---

### validateSchema Example

#### validateSchema Schema Definition

```typescript
import { typeField, validateSchema } from "@leewinter/type-check";

const schema: ValidationSchema = {
  field1: typeField<number>(SupportedType.NUMBER)
    .minValue(10, "Minimum value is 10.")
    .maxValue(20, "Maximum value is 20."),
};

const modelTooSmall = { field1: 5 };
const modelValid = { field1: 15 };
const modelTooLarge = { field1: 25 };

expect(validateSchema(schema, modelTooSmall).field1).toEqual({
  valid: false,
  validationMessages: ["Minimum value is 10."],
});

expect(validateSchema(schema, modelValid).field1).toEqual({
  valid: true,
  validationMessages: [],
});

expect(validateSchema(schema, modelTooLarge).field1).toEqual({
  valid: false,
  validationMessages: ["Maximum value is 20."],
});
```

## evaluateSchema

Evaluates a given data model against a validation schema and provides detailed results for each field.

---

### evaluateSchema Parameters

- **`schema`**: `Record<string, Validator<unknown>>`  
  The validation schema defining the rules for each field.

- **`model`**: `Record<string, unknown>`  
  The data model containing the fields and their values to validate.

---

### evaluateSchema Returns

- **`Record<string, unknown>`**:  
  A structured result where each field in the schema or model is represented. Each field contains validation details for every rule type in the schema. In contrast to the standard validate this allows form fields to indicate field level validation errors and rules such as required, min/max length, regardless of the result.

---

### Evaluation Details

1. **Field Validation**:

   - Each field in the schema is evaluated using its associated rules from the `Validator` instance.
   - For each rule type (e.g., `required`, `minLength`), the following details are returned:
     - **`params`**: Additional parameters defined for the rule (if any).
     - **`validationMessages`**: The validation message for the rule.
     - **`valid`**: A boolean indicating whether the rule passed validation.

2. **Unhandled Fields**:

   - Any fields present in the `model` but not defined in the `schema` are included in the result.
   - For these fields, all rule types are set to `null`.

3. **Rule Defaults**:
   - If a rule type is not explicitly set for a field, its result is marked as `null`.

---

### Example

#### evaluateSchema Schema Definition

```typescript
const schema = {
  field1: typeField<string>(SupportedType.STRING)
    .required("This field is required.")
    .minLength(3, "Minimum length is 3.")
    .maxLength(5, "Maximum length is 5."),
  field2: typeField<Date>(SupportedType.DATE).custom(
    value => value > new Date("2023-01-01"),
    "Date must be after 2023-01-01."
  ),
};

const model = {
  field1: "Hi", // Fails `minLength`
  field2: new Date("2022-12-31"), // Fails `custom` rule
};

const result = evaluateSchema(schema, model);

expect(result).toEqual({
  field1: {
    required: {
      validationMessages: "This field is required.",
      valid: true,
    },
    minLength: {
      length: 3,
      validationMessages: "Minimum length is 3.",
      valid: false,
    },
    maxLength: {
      length: 5,
      validationMessages: "Maximum length is 5.",
      valid: true,
    },
    custom: null,
    maxValue: null,
    minValue: null,
    isEmail: null,
    isPhoneNumber: null,
    isPostcode: null,
  },
  field2: {
    required: null,
    minLength: null,
    maxLength: null,
    custom: {
      validationMessages: "Date must be after 2023-01-01.",
      valid: false,
    },
    maxValue: null,
    minValue: null,
    isEmail: null,
    isPhoneNumber: null,
    isPostcode: null,
  },
});
```

## Validator Methods

### `required(message: string): Validator<T>`

Marks the field as required.

### `minLength(length: number, message: string): Validator<T>`

Sets a minimum length for the field (for strings, arrays, etc.).

### `maxLength(length: number, message: string): Validator<T>`

Sets a maximum length for the field (for strings, arrays, etc.).

### `minValue(value: number, message: string): Validator<T>`

Sets a minimum value for the field (for numbers).

### `maxValue(value: number, message: string): Validator<T>`

Sets a maximum value for the field (for numbers).

### `isEmail(message: string): Validator<T>`

Validates that the field is a valid email address.

### `isPostcode(message: string): Validator<T>`

Validates that the field is a valid UK postcode.

### `isPhoneNumber(message: string): Validator<T>`

Validates that the field is a valid phone number.

### `custom(fn: (value: T, model: Record<string, any>) => boolean, message: string): Validator<T>`

Adds a custom validation rule.
