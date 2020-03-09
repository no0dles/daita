import {SqlSelect} from './sql-select';
import {SqlRawValue} from './sql-raw-value';
import {SqlTable} from './sql-table';

export interface SqlInsert {
  insert: SqlTable;
  into: string[];
  values: SqlRawValue[] | SqlRawValue[][] | SqlSelect;
}