import { RuleDescription } from '../permission';

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  rules?: RuleDescription[];
}
