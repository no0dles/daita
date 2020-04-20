import { SqlInOperand } from './sql-in-operand';
import { SqlRawValue } from '../sql-raw-value';
import { SqlSelect } from '../select';
import { SqlValue } from '../sql-value';
import { isKind } from '@daita/common';

export interface SqlInExpression {
  left: SqlValue;
  operand: SqlInOperand;
  value: SqlRawValue[] | SqlSelect;
}

export const isSqlInExpression = (val: any): val is SqlInExpression =>
  isKind<SqlInExpression>(val, ['left', 'value', 'operand']);
