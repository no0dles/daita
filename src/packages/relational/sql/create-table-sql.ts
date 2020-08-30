import { TableDescription } from './description/table';
import { isKind } from '../../common/utils';

export interface CreateTableColumn {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
}

export interface CreateTableSql {
  createTable: TableDescription<any>;
  ifNotExists?: boolean;
  columns: CreateTableColumn[];
}

export const isCreateTableSql = (val: any): val is CreateTableSql =>
  isKind<CreateTableSql>(val, ['createTable', 'columns']);
