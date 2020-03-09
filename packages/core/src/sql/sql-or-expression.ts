import {SqlExpression} from './sql-expression';

export interface SqlOrExpression {
  or: SqlExpression[];
}