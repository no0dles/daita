import { TablePermission } from "@daita/relational";

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  permissions?: TablePermission<T>[];
}
