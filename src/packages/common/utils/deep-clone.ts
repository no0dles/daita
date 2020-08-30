export function deepClone<T>(value: T): T {
  if (value === null) {
    return null as any;
  }

  if (value === undefined) {
    return undefined as any;
  }

  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (value instanceof Date) {
    return new Date(value.getTime()) as any;
  }

  if (value instanceof Array) {
    return [...value.map(item => deepClone<T>(item))] as any;
  }

  const clone: any = Object.create(value as any);
  for (const key of Object.keys(value)) {
    const prop = (value as any)[key];
    clone[key] = deepClone(prop);
  }

  return clone;
}
