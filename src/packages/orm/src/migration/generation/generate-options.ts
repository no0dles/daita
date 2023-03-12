import { SchemaDescription } from '../../schema';

export interface GenerateOptions<T, O> {
  addFunction: (schema: SchemaDescription, result: T) => O[];
  mergeFunction: (schema: SchemaDescription, prev: T, next: T) => O[];
  removeFunction: (schema: SchemaDescription, prev: T) => O[];
}
