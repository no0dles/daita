import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '../../../../common/utils/is-kind';

export interface CreateIndexSql<T> {
  createIndex: string;
  unique?: boolean;
  on: TableDescription<T>;
  columns: (keyof T)[];
}

export const isCreateIndexSql = (val: any): val is CreateIndexSql<any> => isKind(val, ['createIndex', 'on', 'columns']);
