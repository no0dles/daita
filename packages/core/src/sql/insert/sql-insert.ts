import {SqlInsertValue} from './sql-insert-value';
import {SqlTable} from '../sql-table';
import {SqlSelect} from '../select';
import {isKind} from '../../utils/is-kind';

export interface SqlInsert {
  insert: SqlTable;
  values: SqlInsertValue | SqlInsertValue[] | SqlSelect;
}

export const isSqlInsert = (val: any): val is SqlInsert => isKind<SqlInsert>(val, ['insert', 'values']);