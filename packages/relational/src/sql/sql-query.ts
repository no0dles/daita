import { isSqlSelect, SqlSelect } from './select/sql-select';
import { isSqlDelete, SqlDelete } from './delete/sql-delete';
import { isSqlInsert, SqlInsert } from './insert/sql-insert';
import { isSqlUpdate, SqlUpdate } from './update/sql-update';

export type SqlQuery = SqlSelect | SqlDelete | SqlUpdate | SqlInsert;

export const isSqlQuery = (val: any): val is SqlQuery =>
  isSqlSelect(val) || isSqlDelete(val) || isSqlUpdate(val) || isSqlInsert(val);
