import {SqlValue} from './sql-value';
import {SqlOperand} from './sql-operand';

export interface SqlCompareExpression {
  left: SqlValue;
  right: SqlValue;
  operand: SqlOperand;
}
