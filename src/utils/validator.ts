import type { Issue, SchemaNode } from "../types";

export function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

export function normalizeJsonText(text: string): string {
  let cleaned = text.trim();
  if (!cleaned) return cleaned;

  // Remove wrapping triple quotes if pasted from docs.
  cleaned = cleaned.replace(/^"""\s*/, "").replace(/\s*"""$/, "");

  // Replace doubled quotes often seen in copied examples.
  cleaned = cleaned.replace(/""""/g, '"').replace(/""/g, '"');

  return cleaned;
}

export function isPlainObject(
  value: unknown,
): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function getType(value: unknown): string {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value === "object" ? "object" : typeof value;
}

export function validateAgainstSchema(
  value: unknown,
  schema: SchemaNode | null,
  path = "root",
  issues: Issue[] = [],
): Issue[] {
  if (!schema) {
    return issues;
  }

  const actualType = getType(value);

  if (schema.type && actualType !== schema.type) {
    issues.push({
      path,
      type: "Type mismatch",
      message: `Expected ${schema.type} but found ${actualType}`,
    });
    return issues;
  }

  if (schema.equals !== undefined && value !== schema.equals) {
    issues.push({
      path,
      type: "Incorrect value",
      message: `Expected value ${JSON.stringify(schema.equals)} but found ${JSON.stringify(value)}`,
    });
  }

  if (schema.oneOf && !schema.oneOf.includes(value as never)) {
    issues.push({
      path,
      type: "Invalid value",
      message: `Expected one of ${schema.oneOf.map((x) => JSON.stringify(x)).join(", ")} but found ${JSON.stringify(value)}`,
    });
  }

  if (schema.type === "object" && schema.required) {
    if (!isPlainObject(value)) {
      issues.push({
        path,
        type: "Type mismatch",
        message: "Expected an object",
      });
      return issues;
    }

    for (const [key, childSchema] of Object.entries(schema.required)) {
      const childPath = path === "root" ? key : `${path}.${key}`;

      if (!(key in value)) {
        issues.push({
          path: childPath,
          type: "Missing key",
          message: `Required key ${key} is missing`,
        });
        continue;
      }

      validateAgainstSchema(
        (value as Record<string, unknown>)[key],
        childSchema,
        childPath,
        issues,
      );
    }
  }

  if (schema.type === "array") {
    if (!Array.isArray(value)) {
      issues.push({
        path,
        type: "Type mismatch",
        message: "Expected an array",
      });
      return issues;
    }

    if (schema.minItems !== undefined && value.length < schema.minItems) {
      issues.push({
        path,
        type: "Too few items",
        message: `Expected at least ${schema.minItems} item(s) but found ${value.length}`,
      });
    }

    if (schema.itemSchema) {
      value.forEach((item, index) => {
        validateAgainstSchema(
          item,
          schema.itemSchema!,
          `${path}[${index}]`,
          issues,
        );
      });
    }
  }

  return issues;
}

export function parseJsonInput(raw: string): unknown {
  const normalized = normalizeJsonText(raw);
  return JSON.parse(normalized);
}
