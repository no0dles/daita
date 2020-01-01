export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
}
