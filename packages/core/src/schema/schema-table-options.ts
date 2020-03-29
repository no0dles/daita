import {TablePermission} from '../permission';

export interface SchemaTableOptions<T> {
  key: keyof T | (keyof T)[];
  permissions?: TablePermission<T>[];
}
