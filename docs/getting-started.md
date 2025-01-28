# Getting Started

## Installation

Install the library via npm:

```bash
npm install @leewinter/type-check
```

## Usage

### Importing the Library

```typescript
import { typeField } from "@leewinter/type-check";
```

---

### Creating Validators

#### Strings

```typescript
const schema = {
  name: typeField<string>(SupportedType.STRING).required("Name is required."),
};
```

#### Numbers

```typescript
const schema = {
  age: typeField<number>(SupportedType.NUMBER)
    .required("Age is required.")
    .minLength(1, "Age must be at least 1."),
};
```

#### Objects

```typescript
const schema = {
  user: typeField<Record<string, any>>(SupportedType.OBJECT).required(
    "User object is required."
  ),
};
```

#### Arrays

```typescript
const schema = {
  items: typeField<number[]>(SupportedType.ARRAY).required(
    "Items are required."
  ),
};
```

#### Functions

```typescript
const schema = {
  callback: typeField<() => void>(SupportedType.FUNCTION).required(
    "Callback function is required."
  ),
};
```

#### Symbols

```typescript
const schema = {
  uniqueId: typeField<symbol>(SupportedType.SYMBOL).required(
    "Unique ID is required."
  ),
};
```

---

### Validating Data

Use `validateSchema` to validate your data model against the schema.

```typescript
import { validateSchema } from "@leewinter/type-check";

const schema = {
  name: typeField<string>(SupportedType.STRING).required("Name is required."),
  age: typeField<number>(SupportedType.NUMBER).minLength(
    16,
    "Age must be at least 16."
  ),
};

const model = {
  name: "",
  age: 0,
};

const result = validateSchema(schema, model);

console.log(result);
```

### Example Output

```json
{
  "name": {
    "required": {
      "validationMessages": "Name is required.",
      "valid": false
    },
    "minLength": null,
    "maxLength": null,
    "custom": null
  },
  "age": {
    "required": null,
    "minLength": {
      "length": 1,
      "validationMessages": "Age must be at least 16.",
      "valid": false
    },
    "maxLength": null,
    "custom": null
  }
}
```

## License

This library is licensed under the [MIT License](https://github.com/leewinter/type-check/blob/main/LICENSE).

---

## Support

For any questions or issues, feel free to open an issue on [GitHub](https://github.com/leewinter/type-check).
