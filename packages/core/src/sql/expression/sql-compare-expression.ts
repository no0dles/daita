import { SqlOperand } from './sql-operand';
import { isKind } from '../../utils/is-kind';
import { SqlValue } from '../sql-value';

export interface SqlCompareExpression {
  left: SqlValue;
  right: SqlValue;
  operand: SqlOperand;
}

export const isSqlCompareExpression = (val: any): val is SqlCompareExpression =>
  isKind<SqlCompareExpression>(val, ['left', 'right', 'operand']);
