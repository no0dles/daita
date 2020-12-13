import { TableDescription } from '../../keyword/table/table-description';
import { isExactKind } from '../../../../common/utils/is-exact-kind';
import { isKind } from '../../../../common/utils/is-kind';

export type AlterTableSql =
  | AlterTableAddColumnSql
  | AlterTableDropColumnSql
  | AlterTableDropConstraintSql
  | AlterTableAddForeignKeySql<string>
  | AlterTableAddForeignKeySql<string[]>;

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
  };
}

export const isAlterTableAddForeignKeySql = (val: any): val is AlterTableAddForeignKeySql<any> =>
  isExactKind<AlterTableAddForeignKeySql<any>>(val, ['alterTable', 'add']) &&
  isKind(val.add, ['foreignKey', 'references']);
