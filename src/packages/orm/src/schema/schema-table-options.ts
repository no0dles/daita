export type SchemaTableIndexOption<T> = keyof T | (keyof T)[] | { columns: string | string[]; unique: boolean };

export interface SchemaTableOptions<T> {
  key?: keyof T | (keyof T)[];
  indices?: { [key: string]: SchemaTableIndexOption<T> };
  columns?: { [P in keyof T]?: { size?: number } };
}

export interface SchemaTableRequiredKeyOptions<T> {
  key: keyof T | (keyof T)[];
  indices?: { [key: string]: SchemaTableIndexOption<T> };
  columns?: { [P in keyof T]?: { size?: number } };
}
