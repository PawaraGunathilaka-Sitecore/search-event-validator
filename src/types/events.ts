import { ZodTypeAny } from "zod";

export interface EventDefinition {
  name: string;
  schema: ZodTypeAny;
  sample: unknown;
}

export interface ValidationIssue {
  path: string;
  message: string;
}
