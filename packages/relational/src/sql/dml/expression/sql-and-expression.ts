import { SqlExpression } from './sql-expression';
import { isKind } from '@daita/common';

export interface SqlAndExpression {
  and: SqlExpression[];
}

export const isSqlAndExpression = (val: any): val is SqlAndExpression =>
  isKind<SqlAndExpression>(val, ['and']);
