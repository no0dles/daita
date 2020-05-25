import {
  AliasFormatter, AlterTableFormatter, CreateTableFormatter, DeleteFormatter, DropTableFormatter,
  EscapeFormatter,
  ExpressionFormatter, FieldFormatter, FieldTypeFormatter, Formatter, FunctionFormatter, InsertFormatter,
  SelectFormatter, TableFormatter, UpdateFormatter,
  ValueFormatter, LockTableFormatter, CreateSchemaFormatter,
} from '@daita/relational';
import { PostgresFieldType } from './dml/postgres-field-type';

export const postgresFormatter = new Formatter();
postgresFormatter.add(new TableFormatter());
postgresFormatter.add(new InsertFormatter({
  valuesKeyword: 'VALUES',
  insertKeyword: 'INSERT INTO',
}));
postgresFormatter.add(new SelectFormatter({
  onKeyword: 'ON',
  havingKeyword: 'HAVING',
  offsetKeyword: 'OFFSET',
  limitKeyword: 'LIMIT',
  groupByKeyword: 'GROUP BY',
  orderByKeyword: 'ORDER BY',
  selectKeyword: 'SELECT',
  fromKeyword: 'FROM',
  ascKeyword: 'ASC',
  descKeyword: 'DESC',
}));
postgresFormatter.add(new UpdateFormatter({
  updateKeyword: 'UPDATE',
  setKeyword: 'SET',
}));
postgresFormatter.add(new DeleteFormatter({
  deleteKeyword: 'DELETE FROM',
}));
postgresFormatter.add(new LockTableFormatter({
  lockTableKeyword: 'LOCK TABLE',
}));
postgresFormatter.add(new FieldTypeFormatter({
  formatFieldType(fieldType: PostgresFieldType): string {
    switch (fieldType) {
      case 'boolean':
        return 'BOOLEAN';
      case 'string':
        return 'VARCHAR';
      case 'date':
        return 'TIMESTAMPTZ';
      case 'number':
        return 'NUMERIC';
      case 'number[]':
        return 'NUMERIC[]';
      case 'string[]':
        return 'VARCHAR';
      case 'boolean[]':
        return 'BOOLEAN';
      case 'date[]':
        return 'TIMESTAMPTZ[]';
    }
    throw new Error('unknown type');
  },
}));
postgresFormatter.add(new FunctionFormatter({
  distinctKeyword: 'DISTINCT',
  allKeyword: '*',
}));
postgresFormatter.add(new FieldFormatter({
  allKeyword: '*',
}));
postgresFormatter.add(new AliasFormatter({
  aliasKeyword: 'AS',
}));
postgresFormatter.add(new ValueFormatter());
postgresFormatter.add(new EscapeFormatter({ escapeCharacter: '"' }));
postgresFormatter.add(new DropTableFormatter({
  dropTableKeyword: 'DROP TABLE',
  ifExistsKeyword: 'IF EXISTS',
}));
postgresFormatter.add(new CreateTableFormatter({
  createTableKeyword: 'CREATE TABLE',
  ifNotExistsKeyword: 'IF NOT EXISTS',
  notNullKeyword: 'NOT NULL',
  primaryKeyKeyword: 'PRIMARY KEY',
}));
postgresFormatter.add(new ExpressionFormatter({
  andKeyword: 'AND',
  orKeyword: 'OR',
  whereKeyword: 'WHERE',
}));
postgresFormatter.add(new CreateSchemaFormatter({
  createSchemaKeyword: 'CREATE SCHEMA',
  ifNotExistsKeyword: 'IF NOT EXISTS',
}));
postgresFormatter.add(new AlterTableFormatter({
  columnKeyword: 'COLUMN',
  dropColumnKeyword: 'DROP COLUMN',
  dropConstraintKeyword: 'DROP CONSTRAINT',
  alterTableKeyword: 'ALTER TABLE',
  constraintKeyword: 'CONSTRAINT',
  addKeyword: 'ADD',
  foreignKeyKeyword: 'FOREIGN KEY',
  foreignKeyReferenceKeyword: 'REFERENCES',
}));
