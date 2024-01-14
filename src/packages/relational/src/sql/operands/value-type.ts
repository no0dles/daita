import { Json } from '../../types/json/json';

export type ValueType = number | string | boolean | Date | Json<any> | undefined | null;

export const isValueType = (val: any): val is ValueType =>
  typeof val === 'number' ||
  typeof val === 'string' ||
  typeof val === 'boolean' ||
  val instanceof Date ||
  val === undefined ||
  val === null;
