import { SqlRawValue } from './sql-raw-value';
import { isKind } from '@daita/common';

export interface SqlRawAliasValue {
  value: SqlRawValue;
  alias: string;
}

export const isSqlRawAliasValue = (val: any): val is SqlRawAliasValue =>
  isKind<SqlRawAliasValue>(val, ['value', 'alias']);
