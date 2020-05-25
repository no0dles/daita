export type SqlRawValue = number | Date | string | boolean | null | undefined | string[] | number[] | Date[] | boolean[];

export const isSqlRawValue = (val: any): val is SqlRawValue =>
  typeof val === 'number' ||
  typeof val === 'string' ||
  typeof val === 'boolean' ||
  val instanceof Date ||
  val instanceof Array ||
  val === null ||
  val === undefined;
