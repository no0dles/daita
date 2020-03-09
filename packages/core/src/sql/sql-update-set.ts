import {SqlSelect} from './sql-select';
import {SqlRawValue} from './sql-raw-value';
import {SqlField} from './sql-field';
import {SqlFunction} from './sql-function';

export type SqlUpdateSet = SqlRawValue | SqlSelect | SqlField | SqlFunction;