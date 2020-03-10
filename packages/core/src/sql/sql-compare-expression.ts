import {SqlValue} from './sql-value';
import {SqlOperand} from './sql-operand';
import {isKind} from '../utils/is-kind';

export interface SqlCompareExpression {
  left: SqlValue;
  right: SqlValue;
  operand: SqlOperand;
}

export const isSqlCompareExpression = (val: any): val is SqlCompareExpression => isKind<SqlCompareExpression>(val, ['left', 'right', 'operand']);