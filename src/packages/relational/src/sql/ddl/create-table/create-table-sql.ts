import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common/utils/is-kind';
import { table } from '../../..';

export interface CreateTableColumn {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
  size?: number;
}

export interface CreateTableSql {
  createTable: TableDescription<any>;
  ifNotExists?: boolean;
  columns: CreateTableColumn[];
  foreignKey?: { [key: string]: CreateTableForeignKey };
}

export interface CreateTableForeignKey {
  key: string | string[];
  references: {
    table: TableDescription<any>;
    primaryKey: string | string[];
  };
}

export const isCreateTableSql = (val: any): val is CreateTableSql =>
  isKind<CreateTableSql>(val, ['createTable', 'columns']);
