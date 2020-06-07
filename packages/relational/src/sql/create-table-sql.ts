import { isKind } from '@daita/common';
import { TableDescription } from './description/table';

export interface CreateTableSql {
  createTable: TableDescription<any>;
  ifNotExists?: boolean;
  columns: {
    name: string, type: string,
    notNull?: boolean
    primaryKey?: boolean
  }[];
}

export const isCreateTableSql = (val: any): val is CreateTableSql => isKind<CreateTableSql>(val, ['createTable', 'columns']);
