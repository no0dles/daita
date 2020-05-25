import { SqlOperand } from './sql-operand';
import { isKind } from '@daita/common';
import { SqlValue } from '../sql-value';

export interface SqlCompareExpression {
  left: SqlValue;
  right: SqlValue;
  operand: SqlOperand;
}

export const isSqlCompareExpression = (val: any): val is SqlCompareExpression =>
  isKind<SqlCompareExpression>(val, ['left', 'right', 'operand']);
