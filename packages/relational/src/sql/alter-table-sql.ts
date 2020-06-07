import { TableDescription } from './description/table';
import { isExactKind, isKind } from '@daita/common';

export type AlterTableSql =
  AlterTableAddColumnSql
  | AlterTableDropColumnSql
  | AlterTableDropConstraintSql
  | AlterTableAddForeignKeySql<string>
  | AlterTableAddForeignKeySql<string[]>;

export interface AlterTableDropColumnSql {
  alterTable: TableDescription<any>;
  drop: { column: string }
}

export const isAlterTableDropColumnSql = (val: any): val is AlterTableDropColumnSql => isExactKind<AlterTableDropColumnSql>(val, ['alterTable', 'drop']) && isExactKind(val.drop, ['column']);

export interface AlterTableDropConstraintSql {
  alterTable: TableDescription<any>;
  drop: { constraint: string }
}

export const isAlterTableDropConstraintSql = (val: any): val is AlterTableDropConstraintSql => isExactKind<AlterTableDropConstraintSql>(val, ['alterTable', 'drop']) && isExactKind(val.drop, ['constraint']);

export interface AlterTableAddColumnSql {
  alterTable: TableDescription<any>;
  add: { column: string, type: string }
}

export const isAlterTableAddColumnSql = (val: any): val is AlterTableAddColumnSql => isExactKind<AlterTableAddColumnSql>(val, ['alterTable', 'add']) && isExactKind(val.add, ['column', 'type']);

export interface AlterTableAddForeignKeySql<T> {
  alterTable: TableDescription<any>;
  add: {
    foreignKey: T;
    constraint?: string;
    references: {
      table: TableDescription<any>;
      primaryKeys: T;
    };
  }
}

export const isAlterTableAddForeignKeySql = (val: any): val is AlterTableAddForeignKeySql<any> => isExactKind<AlterTableAddForeignKeySql<any>>(val, ['alterTable', 'add']) && isKind(val.add, ['foreignKey', 'references']);
