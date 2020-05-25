import { RelationalEmptyExpressionBuilder } from './relational-empty-expression-builder';
import { SqlExpression } from '../sql/dml/expression';

export interface RelationalExpressionBuilder<T>
  extends RelationalEmptyExpressionBuilder<T> {
  expression: SqlExpression;
}
