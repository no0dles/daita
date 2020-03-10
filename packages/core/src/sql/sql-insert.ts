import {SqlSelect} from './sql-select';
import {SqlRawValue} from './sql-raw-value';
import {SqlTable} from './sql-table';
import {isKind} from '../utils/is-kind';

export interface SqlInsert {
  insert: SqlTable;
  into: string[];
  values: SqlRawValue[] | SqlRawValue[][] | SqlSelect;
}

export const isSqlInsert = (val: any): val is SqlInsert => isKind<SqlInsert>(val, ['insert', 'into', 'values']);