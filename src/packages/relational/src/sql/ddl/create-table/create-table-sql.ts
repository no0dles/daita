import { TableDescription } from '../../keyword/table/table-description';
import { isKind } from '@daita/common';

export interface CreateTableColumn {
  name: string;
  type: string;
  notNull?: boolean;
  primaryKey?: boolean;
  defaultValue?: any;
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
  onDelete?: ForeignKeyConstraint;
  onUpdate?: ForeignKeyConstraint;
}

export type ForeignKeyConstraint = 'cascade' | 'set null' | 'default' | 'restrict' | 'no action';

export const isCreateTableSql = (val: any): val is CreateTableSql =>
  isKind<CreateTableSql>(val, ['createTable', 'columns']);
