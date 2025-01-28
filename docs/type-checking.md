# Type Checking

## checkType

### Response

```typescript
import { checkType } from "@leewinter/type-check";

const result = checkType(42);

expect(result).toEqual({
  jsType: "number",
  tsType: "number",
  validEmail: () => boolean,
  validPhoneNumber: () => boolean,
  validUkPostcode: () => boolean,
});
```

---

### Data Check

```typescript
import { checkType } from "@leewinter/type-check";

const result = checkDataType("test@example.com");

expect(result.validEmail()).toBe(true);
```

---

### Supported Types

```typescript
import { SupportedType } from "@leewinter/type-check";

console.log(SupportedType);

{
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  OBJECT: "object",
  ARRAY: "array",
  FUNCTION: "function",
  SYMBOL: "symbol",
  UNDEFINED: "undefined",
  NULL: "null",
  REGEXP: "regexp",
  MAP: "map",
  SET: "set"
}
```

### Individual Imports

```typescript
import {
  checkJsType,
  checkTsType,
  checkDataType,
  SupportedType,
} from "@leewinter/type-check";

expect(checkJsType([])).toBe(SupportedType.ARRAY);

expect(checkTsType(-42)).toBe(SupportedType.NUMBER);

expect(checkDataType("SW1A 1AA").validUkPostcode()).toBe(true);
```
