import {SqlValue} from './sql-value';
import {SqlInOperand} from './sql-in-operand';
import {SqlRawValue} from './sql-raw-value';
import {SqlSelect} from './sql-select';
import {isKind} from '../utils/is-kind';

export interface SqlInExpression {
  left: SqlValue;
  operand: SqlInOperand;
  value: SqlRawValue[] | SqlSelect;
}

export const isSqlInExpression = (val: any): val is SqlInExpression => isKind<SqlInExpression>(val, ['left', 'value', 'operand']);