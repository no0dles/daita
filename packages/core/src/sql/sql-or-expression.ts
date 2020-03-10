import {SqlExpression} from './sql-expression';
import {isKind} from '../utils/is-kind';

export interface SqlOrExpression {
  or: SqlExpression[];
}
export const isSqlOrExpression = (val: any): val is SqlOrExpression => isKind<SqlOrExpression>(val, ['or']);