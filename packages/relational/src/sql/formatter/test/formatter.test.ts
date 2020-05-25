import { SqlRawValue } from '../../dml';
import { Formatter } from '../formatter';
import { TableFormatter } from '../table-formatter';
import { FieldTypeFormatter } from '../field-type-formatter';
import { EscapeFormatter } from '../escape-formatter';
import { AlterTableFormatter } from '../alter-table-formatter';
import { InsertFormatter } from '../insert-formatter';
import { SelectFormatter } from '../select-formatter';
import { UpdateFormatter } from '../update-formatter';
import { DeleteFormatter } from '../delete-formatter';
import { ValueFormatter } from '../value-formatter';
import { FunctionFormatter } from '../function-formatter';
import { DropTableFormatter } from '../drop-table-formatter';
import { CreateTableFormatter } from '../create-table-formatter';
import { ExpressionFormatter } from '../expression-formatter';
import { CounterFormatContext } from '../counter-format-context';
import { FieldFormatter } from '../field-formatter';
import { AliasFormatter } from '../alias-formatter';
import { LockTableFormatter } from '../lock-table-formatter';
import { CreateSchemaFormatter } from '../create-schema-formatter';

export interface TestFormatterOptions {
  query: any;
  expectedFormat: string;
  expectedValues?: SqlRawValue[];
}

export const testFormatter = new Formatter();
testFormatter.add(new TableFormatter());
testFormatter.add(new InsertFormatter({
  valuesKeyword: 'VALUES',
  insertKeyword: 'INSERT INTO',
}));
testFormatter.add(new SelectFormatter({
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
testFormatter.add(new UpdateFormatter({
  updateKeyword: 'UPDATE',
  setKeyword: 'SET',
}));
testFormatter.add(new DeleteFormatter({
  deleteKeyword: 'DELETE FROM',
}));
testFormatter.add(new LockTableFormatter({
  lockTableKeyword: 'LOCK TABLE',
}));
testFormatter.add(new FieldTypeFormatter({
  formatFieldType(fieldType: any): string {
    return fieldType;
  },
}));
testFormatter.add(new FunctionFormatter({
  distinctKeyword: 'DISTINCT',
  allKeyword: '*',
}));
testFormatter.add(new FieldFormatter({
  allKeyword: '*'
}));
testFormatter.add(new AliasFormatter({
  aliasKeyword: 'AS',
}));
testFormatter.add(new ValueFormatter());
testFormatter.add(new EscapeFormatter({ escapeCharacter: '"' }));
testFormatter.add(new DropTableFormatter({
  dropTableKeyword: 'DROP TABLE',
  ifExistsKeyword: 'IF EXISTS',
}));
testFormatter.add(new CreateTableFormatter({
  createTableKeyword: 'CREATE TABLE',
  ifNotExistsKeyword: 'IF NOT EXISTS',
  notNullKeyword: 'NOT NULL',
  primaryKeyKeyword: 'PRIMARY KEY',
}));
testFormatter.add(new ExpressionFormatter({
  andKeyword: 'AND',
  orKeyword: 'OR',
  whereKeyword: 'WHERE',
}));
testFormatter.add(new AlterTableFormatter({
  columnKeyword: 'COLUMN',
  dropColumnKeyword: 'DROP COLUMN',
  dropConstraintKeyword: 'DROP CONSTRAINT',
  alterTableKeyword: 'ALTER TABLE',
  constraintKeyword: 'CONSTRAINT',
  addKeyword: 'ADD',
  foreignKeyKeyword: 'FOREIGN KEY',
  foreignKeyReferenceKeyword: 'REFERENCES',
}));
testFormatter.add(new CreateSchemaFormatter({
  ifNotExistsKeyword: 'IF NOT EXISTS',
  createSchemaKeyword: 'CREATE SCHEMA',
}));

export function testFormat(options: TestFormatterOptions) {
  it(`should format to "${options.expectedFormat}"`, () => {
    const formatContext = new CounterFormatContext('$');
    const result = testFormatter.format(options.query, formatContext);
    expect(result).toEqual(options.expectedFormat);
    if (options.expectedValues !== undefined && options.expectedFormat !== null) {
      expect(formatContext.getValues()).toEqual(options.expectedValues);
    }
  });
}
