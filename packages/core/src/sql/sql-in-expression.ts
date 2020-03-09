import {SqlValue} from './sql-value';
import {SqlInOperand} from './sql-in-operand';
import {SqlRawValue} from './sql-raw-value';
import {SqlSelect} from './sql-select';

export interface SqlInExpression {
  left: SqlValue;
  operand: SqlInOperand;
  value: SqlRawValue[] | SqlSelect;
}