import {
  AliasFormatter, CreateTableFormatter,
  DeleteFormatter, DropTableFormatter, EscapeFormatter, ExpressionFormatter, FieldFormatter, FieldTypeFormatter,
  Formatter, FunctionFormatter,
  InsertFormatter,
  SelectFormatter, SqlFieldType,
  TableFormatter,
  UpdateFormatter, ValueFormatter,
} from '@daita/relational';

export const sqliteFormatter = new Formatter();
sqliteFormatter.add(new TableFormatter());
sqliteFormatter.add(new InsertFormatter({
  valuesKeyword: 'VALUES',
  insertKeyword: 'INSERT INTO',
}));
sqliteFormatter.add(new SelectFormatter({
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
sqliteFormatter.add(new UpdateFormatter({
  updateKeyword: 'UPDATE',
  setKeyword: 'SET',
}));
sqliteFormatter.add(new DeleteFormatter({
  deleteKeyword: 'DELETE FROM',
}));
sqliteFormatter.add(new FieldTypeFormatter({
  formatFieldType(fieldType: SqlFieldType): string {
    switch (fieldType) {
      case 'boolean':
        return 'NUMERIC';
      case 'string':
        return 'TEXT';
      case 'date':
        return 'NUMERIC';
      case 'number':
        return 'NUMERIC';
    }
    throw new Error('unknown type');
  },
}));
sqliteFormatter.add(new FunctionFormatter({
  distinctKeyword: 'DISTINCT',
  allKeyword: '*',
}));
sqliteFormatter.add(new FieldFormatter({
  allKeyword: '*',
}));
sqliteFormatter.add(new AliasFormatter({
  aliasKeyword: 'AS',
}));
sqliteFormatter.add(new ValueFormatter());
sqliteFormatter.add(new EscapeFormatter({ escapeCharacter: '"' }));
sqliteFormatter.add(new DropTableFormatter({
  dropTableKeyword: 'DROP TABLE',
  ifExistsKeyword: 'IF EXISTS',
}));
sqliteFormatter.add(new CreateTableFormatter({
  createTableKeyword: 'CREATE TABLE',
  ifNotExistsKeyword: 'IF NOT EXISTS',
  notNullKeyword: 'NOT NULL',
  primaryKeyKeyword: 'PRIMARY KEY',
}));
sqliteFormatter.add(new ExpressionFormatter({
  andKeyword: 'AND',
  orKeyword: 'OR',
  whereKeyword: 'WHERE',
}));
