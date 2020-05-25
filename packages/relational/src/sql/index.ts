import { isSqlDdlQuery, SqlDdlQuery } from './ddl';
import { isSqlDmlQuery, SqlDmlQuery } from './dml';

export * from './dml';
export * from './formatter';
export { SqlField } from './sql-field';
export * from './ddl';
export { SqlSchemaTable, isSqlSchemaTable } from './sql-schema-table';
export { SqlSchemaTableField, isSqlSchemaTableField } from './sql-schema-table-field';
export { SqlTable, isSqlTable, getSqlTableIdentifier, getSqlSchemaTable } from './sql-table';

export type SqlQuery = SqlDdlQuery | SqlDmlQuery;

export const isSqlQuery = (val: any) => isSqlDmlQuery(val) || isSqlDdlQuery(val);
