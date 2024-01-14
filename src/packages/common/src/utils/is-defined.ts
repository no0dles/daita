export function isDefined<T>(val: T, message?: string): asserts val is NonNullable<T> {
  if (val === null || val === undefined) {
    throw new Error(message ?? 'value is null/undefined');
  }
}
