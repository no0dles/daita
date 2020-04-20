import { TablePermission } from "@daita/core";

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  permissions?: TablePermission<T>[];
}
