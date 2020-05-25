import { SqlExpression } from './sql-expression';
import { isKind } from '@daita/common';

export interface SqlOrExpression {
  or: SqlExpression[];
}
export const isSqlOrExpression = (val: any): val is SqlOrExpression =>
  isKind<SqlOrExpression>(val, ['or']);
