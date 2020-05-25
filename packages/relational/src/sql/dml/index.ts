import { isSqlLockTableQuery, SqlLockTableQuery } from './lock-table/lock-table-query';
import { SqlUpdate } from './update';
import { SqlInsert } from './insert';
import { SqlDelete } from './delete';
import { SqlSelect } from './select';
import { isSqlUpdate } from './update/sql-update';
import { isSqlInsert } from './insert/sql-insert';
import { isSqlDelete } from './delete/sql-delete';
import { isSqlSelect } from './select/sql-select';

export * from './delete';
export * from './select';
export * from './update';
export * from './insert';
export * from './expression';
export * from './function';
export { SqlRawAliasValue } from './sql-raw-alias-value';
export { SqlRawValue } from './sql-raw-value';
export { SqlValue } from './sql-value';
export { SqlWhereQuery } from './sql-where-query';

export type SqlDmlQuery = SqlLockTableQuery | SqlUpdate | SqlInsert | SqlDelete | SqlSelect;

export const isSqlDmlQuery = (val: any) => isSqlLockTableQuery(val) || isSqlUpdate(val) || isSqlInsert(val) || isSqlDelete(val) || isSqlSelect(val);
