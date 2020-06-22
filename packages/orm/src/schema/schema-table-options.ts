import { Rule } from '@daita/relational';

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  rules?: Rule[];
}
