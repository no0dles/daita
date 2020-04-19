import { SqlRawValue } from './sql-raw-value';
import { isKind } from '../utils/is-kind';

export interface SqlRawAliasValue {
  value: SqlRawValue;
  alias: string;
}

export const isSqlRawAliasValue = (val: any): val is SqlRawAliasValue =>
  isKind<SqlRawAliasValue>(val, ['value', 'alias']);
