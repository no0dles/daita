export function removeEmptySchema<T extends { schema?: string | null }>(value: T): T {
  if (!value.schema) {
    delete value.schema;
  }
  return value;
}
