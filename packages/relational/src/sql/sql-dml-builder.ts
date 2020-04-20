import { SqlTable } from './sql-table';
import { SqlBaseBuilder } from './sql-base-builder';
import { isKind } from '@daita/common';

export type SqlDmlQuery =
  | SqlCreateTableQuery
  | SqlDropTableQuery
  | SqlAlterTableQuery;

export interface SqlCreateTableQuery {
  createTable: SqlTable;
  ifNotExist?: boolean;
  fields: SqlCreateFieldQuery[];
}

export const isSqlCreateTable = (val: any): val is SqlCreateTableQuery =>
  isKind<SqlCreateTableQuery>(val, ['createTable', 'fields']);

export interface SqlCreateFieldQuery {
  name: string;
  type: SqlFieldType;
  notNull?: boolean;
  primaryKey?: boolean;
}

export type SqlFieldType =
  | 'string'
  | 'number'
  | 'date'
  | 'boolean'
  | 'string[]'
  | 'number[]'
  | 'date[]'
  | 'boolean[]';

export type SqlAlterTableQuery = SqlAlterTableAdd | SqlAlterTableDrop;

export const isSqlAlterTable = (val: any): val is SqlAlterTableQuery =>
  isSqlAlterAddTable(val) || isSqlAlterDropTable(val);

export interface SqlAlterTableAdd {
  alterTable: SqlTable;
  add:
    | SqlAlterTableAddColumn
    | SqlAlterTableAddForeignKey<string>
    | SqlAlterTableAddForeignKey<string[]>;
}

export const isSqlAlterAddTable = (val: any): val is SqlAlterTableAdd =>
  isKind<SqlAlterTableAdd>(val, ['alterTable', 'add']);

export interface SqlAlterTableDrop {
  alterTable: SqlTable;
  drop: SqlAlterTableDropColumn | SqlAlterTableDropConstraint;
}

export const isSqlAlterDropTable = (val: any): val is SqlAlterTableDrop =>
  isKind<SqlAlterTableDrop>(val, ['alterTable', 'drop']);

export interface SqlAlterTableDropColumn {
  column: string;
}

export interface SqlAlterTableDropConstraint {
  constraint: string;
}

export interface SqlAlterTableAddColumn {
  column: string;
  type: SqlFieldType;
}

export interface SqlAlterTableAddForeignKey<T> {
  foreignKey: T;
  constraint?: string;
  references: {
    table: SqlTable;
    primaryKeys: T;
  };
}

export interface SqlDropTableQuery {
  dropTable: SqlTable;
  ifExist?: boolean;
}

export const isSqlDropTable = (val: any): val is SqlDropTableQuery =>
  isKind<SqlDropTableQuery>(val, ['dropTable']);

export class SqlDmlBuilder extends SqlBaseBuilder {
  sql = '';

  protected createTableKeyword = 'CREATE TABLE';
  protected dropTableKeyword = 'DROP TABLE';
  protected ifNotExistsKeyword = 'IF NOT EXISTS';
  protected notNullKeyword = 'NOT NULL';
  protected primaryKeyKeyword = 'PRIMARY KEY';
  protected ifExistsKeyword = 'IF EXISTS';
  protected columnKeyword = 'COLUMN';
  protected dropColumnKeyword = 'DROP COLUMN';
  protected dropConstraintKeyword = 'DROP CONSTRAINT';
  protected alterTableKeyword = 'ALTER TABLE';
  protected constraintKeyword = 'CONSTRAINT';
  protected addKeyword = 'ADD';
  protected foreignKeyKeyword = 'FOREIGN KEY';
  protected foreignKeyReferenceKeyword = 'REFERENCES';

  constructor(query: SqlDmlQuery) {
    super();
    const check = query as SqlCreateTableQuery &
      SqlAlterTableQuery &
      SqlDropTableQuery;
    if (check.createTable) {
      this.sql = this.formatCreateTable(check);
    } else if (check.dropTable) {
      this.sql = this.formatDropTable(check);
    } else {
      this.sql = this.formatAlterTable(check);
    }
  }

  protected formatTable(table: SqlTable) {
    if (typeof table === 'string') {
      return this.escapeTable(table);
    } else {
      return this.formatSchemaTableField(table.schema, table.table);
    }
  }

  protected formatDropTable(table: SqlDropTableQuery) {
    let sql = this.dropTableKeyword;
    if (table.ifExist) {
      sql += ` ${this.ifExistsKeyword}`;
    }
    sql += ` ${this.formatTable(table.dropTable)}`;
    return sql;
  }

  protected formatCreateTable(table: SqlCreateTableQuery) {
    let sql = this.createTableKeyword;
    if (table.ifNotExist) {
      sql += ` ${this.ifNotExistsKeyword}`;
    }
    sql += ` ${this.formatTable(table.createTable)}`;

    sql += ` (${table.fields
      .map((field) => {
        let fieldSql = `${this.escapeField(field.name)} ${this.escapeFieldType(
          field.type,
        )}`;
        if (field.notNull) {
          fieldSql += ` ${this.notNullKeyword}`;
        }
        return fieldSql;
      })
      .join(', ')}`;

    const primaryKeys = table.fields
      .filter((field) => field.primaryKey)
      .map((field) => this.escapeField(field.name));

    if (primaryKeys.length > 0) {
      sql += `, ${this.primaryKeyKeyword} (${primaryKeys.join(', ')})`;
    }

    sql += ')';

    return sql;
  }

  protected formatAlterTable(alter: SqlAlterTableQuery) {
    const alterTable = alter as SqlAlterTableAdd & SqlAlterTableDrop;
    let sql = `${this.alterTableKeyword} ${this.formatTable(
      alterTable.alterTable,
    )}`;

    if (alterTable.add) {
      const add = alterTable.add as SqlAlterTableAddColumn &
        SqlAlterTableAddForeignKey<string> &
        SqlAlterTableAddForeignKey<string[]>;
      sql += ` ${this.addKeyword}`;
      if (add.column) {
        sql += ` ${this.columnKeyword} ${this.escapeField(
          add.column,
        )} ${this.escapeFieldType(add.type)}`;
      } else {
        if (add.constraint) {
          sql += ` ${this.constraintKeyword} ${this.escapeConstraint(
            add.constraint,
          )}`;
        }
        if (typeof add.foreignKey === 'string') {
          sql += ` ${this.foreignKeyKeyword} (${this.escapeField(
            add.foreignKey,
          )})`;
        } else {
          sql += ` ${this.foreignKeyKeyword} (${add.foreignKey.map((key) =>
            this.escapeField(key),
          )})`;
        }
        sql += ` ${this.foreignKeyReferenceKeyword} ${this.formatTable(
          add.references.table,
        )}`;
        if (typeof add.references.primaryKeys === 'string') {
          sql += ` (${this.escapeField(add.references.primaryKeys)})`;
        } else {
          sql += ` (${add.references.primaryKeys.map((key) =>
            this.escapeField(key),
          )})`;
        }
      }
    } else {
      const drop = alterTable.drop as SqlAlterTableDropColumn &
        SqlAlterTableDropConstraint;
      if (drop.column) {
        sql += ` ${this.dropColumnKeyword} ${this.escapeField(drop.column)}`;
      } else {
        sql += ` ${this.dropConstraintKeyword} ${this.escapeConstraint(
          drop.constraint,
        )}`;
      }
    }

    return sql;
  }

  protected escapeConstraint(constraint: string) {
    return `${this.escapeCharacter}${constraint}${this.escapeCharacter}`;
  }

  protected escapeFieldType(type: SqlFieldType): string {
    switch (type) {
      case 'boolean':
        return 'BOOLEAN';
      case 'boolean[]':
        return 'BOOLEAN[]';
      case 'string':
        return 'VARCHAR';
      case 'string[]':
        return 'VARCHAR[]';
      case 'date':
        return 'TIME WITH TIMEZONE';
      case 'date[]':
        return 'TIME WITH TIMEZONE[]';
      case 'number':
        return 'NUMERIC';
      case 'number[]':
        return 'NUMERIC[]';
    }
  }
}
