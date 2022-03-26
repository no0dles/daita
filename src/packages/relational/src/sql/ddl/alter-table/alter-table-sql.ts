import { TableDescription } from '../../keyword/table/table-description';
import { isExactKind } from '@daita/common';
import { isKind } from '@daita/common';
import { ForeignKeyConstraint } from '../create-table';

export type AlterTableSql =
  | AlterTableAddColumnSql
  | AlterTableDropColumnSql
  | AlterTableDropConstraintSql
  | AlterTableAddPrimaryKeySql
  | AlterTableAddForeignKeySql<string>
  | AlterTableAddForeignKeySql<string[]>
  | AlterTableRenameSql;

export interface AlterTableRenameSql {
  alterTable: TableDescription<any>;
  renameTo: string;
}

export const isAlterTableRenameSql = (val: any): val is AlterTableRenameSql =>
  isExactKind<AlterTableRenameSql>(val, ['alterTable', 'renameTo']);

export interface AlterTableDropColumnSql {
  alterTable: TableDescription<any>;
  drop: { column: string };
}

export const isAlterTableDropColumnSql = (val: any): val is AlterTableDropColumnSql =>
  isExactKind<AlterTableDropColumnSql>(val, ['alterTable', 'drop']) && isExactKind(val.drop, ['column']);

export interface AlterTableDropConstraintSql {
  alterTable: TableDescription<any>;
  drop: { constraint: string };
}

export const isAlterTableDropConstraintSql = (val: any): val is AlterTableDropConstraintSql =>
  isExactKind<AlterTableDropConstraintSql>(val, ['alterTable', 'drop']) && isExactKind(val.drop, ['constraint']);

export interface AlterTableAddColumnSql {
  alterTable: TableDescription<any>;
  add: { column: string; type: string; size?: number };
}

export const isAlterTableAddColumnSql = (val: any): val is AlterTableAddColumnSql =>
  isExactKind<AlterTableAddColumnSql>(val, ['alterTable', 'add']) && isKind(val.add, ['column', 'type']);

export interface AlterTableAddForeignKeySql<T> {
  alterTable: TableDescription<any>;
  add: {
    foreignKey: T;
    constraint?: string;
    references: {
      table: TableDescription<any>;
      primaryKeys: T;
    };
    onDelete?: ForeignKeyConstraint;
    onUpdate?: ForeignKeyConstraint;
  };
}

export const isAlterTableAddForeignKeySql = (val: any): val is AlterTableAddForeignKeySql<any> =>
  isExactKind<AlterTableAddForeignKeySql<any>>(val, ['alterTable', 'add']) &&
  isKind(val.add, ['foreignKey', 'references']);

export interface AlterTableAddPrimaryKeySql {
  alterTable: TableDescription<any>;
  add: {
    primaryKey: string | string[];
  };
}

export const isAlterTableAddPrimaryKeySql = (val: any): val is AlterTableAddPrimaryKeySql =>
  isExactKind<AlterTableAddPrimaryKeySql>(val, ['alterTable', 'add']) && isExactKind(val.add, ['primaryKey']);
