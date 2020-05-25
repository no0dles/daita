import { isSqlField, SqlField } from '../../sql-field';
import { isSqlRawValue, SqlRawValue } from '../sql-raw-value';
import { SqlSelect } from '../select';
import { isSqlSelect } from '../select/sql-select';
import { isSqlFunction, SqlFunction } from '../function/sql-function';

export type SqlUpdateSet = SqlRawValue | SqlSelect | SqlField | SqlFunction;

export const isSqlUpdateSet = (val: any): val is SqlUpdateSet =>
  isSqlRawValue(val) ||
  isSqlSelect(val) ||
  isSqlFunction(val) ||
  isSqlField(val);
