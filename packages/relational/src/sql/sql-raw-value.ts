export type SqlRawValue = number | Date | string | boolean | null | undefined;

export const isSqlRawValue = (val: any): val is SqlRawValue =>
  typeof val === 'number' ||
  typeof val === 'string' ||
  typeof val === 'boolean' ||
  val === null ||
  val === undefined;
