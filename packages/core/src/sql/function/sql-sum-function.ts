import { isKind } from '../../utils/is-kind';

export interface SqlSumFunction {
  sum: { schema?: string; table?: string; field: string };
}

export const isSqlSumFunction = (val: any): val is SqlSumFunction =>
  isKind<SqlSumFunction>(val, ['sum']);
