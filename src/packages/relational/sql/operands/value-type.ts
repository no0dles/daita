export type ValueType = number | string | boolean | Date | undefined | null;

export const isValueType = (val: any): val is ValueType =>
  typeof val === 'number' ||
  typeof val === 'string' ||
  typeof val === 'boolean' ||
  val instanceof Date ||
  val === undefined ||
  val === null;
