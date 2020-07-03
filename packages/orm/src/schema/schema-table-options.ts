import { Rule } from '@daita/relational';

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  rules?: Rule[];
  indices?: { [key: string]: keyof T | (keyof T)[] | { columns: keyof T | (keyof T[]), unique: boolean } }
}
