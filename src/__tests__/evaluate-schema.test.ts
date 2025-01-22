import { Validator, evaluateSchema } from "../validate-schema";

describe("evaluateSchema", () => {
  it("returns an empty object for an empty schema", () => {
    const schema = {};
    const model = {};

    const result = evaluateSchema(schema, model);

    expect(result).toEqual({});
  });

  it("introspects required fields and excludes satisfied rules", () => {
    const schema = {
      field1: new Validator<string>().required("This field is required."),
    };

    const model = { field1: "Valid" }; // Field satisfies the `required` rule
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({});
  });

  it("includes unmet required rules", () => {
    const schema = {
      field1: new Validator<string>().required("This field is required."),
    };

    const model = { field1: "" }; // Field does not satisfy the `required` rule
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({
      field1: {
        required: {
          validationMessages: "This field is required.",
        },
      },
    });
  });

  it("introspects minLength and maxLength and excludes satisfied rules", () => {
    const schema = {
      field1: new Validator<string>()
        .minLength(3, "Minimum length is 3.")
        .maxLength(5, "Maximum length is 5."),
    };

    const model = { field1: "Valid" }; // Field satisfies both rules
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({});
  });

  it("includes unmet minLength and maxLength rules", () => {
    const schema = {
      field1: new Validator<string>()
        .minLength(3, "Minimum length is 3.")
        .maxLength(5, "Maximum length is 5."),
    };

    const model = { field1: "Hi" }; // Field satisfies neither rule
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({
      field1: {
        minLength: {
          length: 3,
          validationMessages: "Minimum length is 3.",
        },
      },
    });
  });

  it("introspects custom rules and excludes satisfied ones", () => {
    const schema = {
      field2: new Validator<Date>().custom(
        (value, model) => value > new Date("2023-01-01"),
        "Date must be after 2023-01-01.",
      ),
    };

    const model = { field2: new Date("2024-01-01") }; // Field satisfies the `custom` rule
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({});
  });

  it("includes unmet custom rules", () => {
    const schema = {
      field2: new Validator<Date>().custom(
        (value, model) => value > new Date("2023-01-01"),
        "Date must be after 2023-01-01.",
      ),
    };

    const model = { field2: new Date("2022-12-31") }; // Field does not satisfy the `custom` rule
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({
      field2: {
        custom: {
          validationMessages: "Date must be after 2023-01-01.",
        },
      },
    });
  });

  it("handles schemas with multiple fields and mixed results", () => {
    const schema = {
      field1: new Validator<string>()
        .required("This field is required.")
        .minLength(3, "Minimum length is 3.")
        .maxLength(5, "Maximum length is 5."),
      field2: new Validator<Date>().custom(
        (value, model) => value > new Date("2023-01-01"),
        "Date must be after 2023-01-01.",
      ),
    };

    const model = {
      field1: "Hi", // Fails `minLength`
      field2: new Date("2022-12-31"), // Fails `custom` rule
    };

    const result = evaluateSchema(schema, model);

    expect(result).toEqual({
      field1: {
        minLength: {
          length: 3,
          validationMessages: "Minimum length is 3.",
        },
      },
      field2: {
        custom: {
          validationMessages: "Date must be after 2023-01-01.",
        },
      },
    });
  });

  it("handles a schema with no validation rules for a field", () => {
    const schema = {
      field1: new Validator<string>(),
    };

    const model = { field1: "Any value" }; // No rules to check
    const result = evaluateSchema(schema, model);

    expect(result).toEqual({});
  });
});
