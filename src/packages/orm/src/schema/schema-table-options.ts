import { ForeignKeyConstraint } from '@daita/relational';

export type SchemaTableIndexOption<T> = keyof T | (keyof T)[] | { columns: string | string[]; unique: boolean };

export interface SchemaTableOptions<T> {
  key?: keyof T | (keyof T)[];
  indices?: { [key: string]: SchemaTableIndexOption<T> };
  columns?: { [P in keyof T]?: { size?: number } };
  foreignKeys?: { [P in keyof T]?: { onUpdate?: ForeignKeyConstraint; onDelete?: ForeignKeyConstraint } };
}

export interface SchemaTableRequiredKeyOptions<T> {
  key: keyof T | (keyof T)[];
  indices?: { [key: string]: SchemaTableIndexOption<T> };
  columns?: { [P in keyof T]?: { size?: number } };
  foreignKeys?: { [P in keyof T]?: { onUpdate?: ForeignKeyConstraint; onDelete?: ForeignKeyConstraint } };
}
