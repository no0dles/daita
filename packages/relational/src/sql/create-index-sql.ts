import { TableDescription } from './description';
import { isKind } from '@daita/common';

export interface CreateIndexSql<T> {
  createIndex: string;
  unique?: boolean;
  on: TableDescription<T>;
  columns: (keyof T)[];
}

export const isCreateIndexSql = (val: any): val is CreateIndexSql<any> => isKind(val, ['createIndex', 'on', 'columns']);
