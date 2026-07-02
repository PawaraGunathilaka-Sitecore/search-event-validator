export type PrimitiveType =
  | "string"
  | "number"
  | "boolean"
  | "object"
  | "array"
  | "null";

export interface SchemaNode {
  type?: PrimitiveType;
  equals?: string | number | boolean | null;
  oneOf?: Array<string | number | boolean | null>;
  required?: Record<string, SchemaNode>;
  minItems?: number;
  itemSchema?: SchemaNode;
}

export interface EventSpec {
  sample: unknown;
  schema: SchemaNode | null;
}

export interface Issue {
  path: string;
  type: string;
  message: string;
}

export interface RenderPayload {
  issues?: Issue[];
  selectedType?: string;
  expectedKeys?: string[];
  parsedPreview?: string;
}

export type ResultStatus = "success" | "error" | "warn";
