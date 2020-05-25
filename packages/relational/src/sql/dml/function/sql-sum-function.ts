import { isKind } from '@daita/common';

export interface SqlSumFunction {
  sum: { schema?: string; table?: string; field: string };
}

export const isSqlSumFunction = (val: any): val is SqlSumFunction =>
  isKind<SqlSumFunction>(val, ['sum']);
