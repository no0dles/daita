import {SqlTable} from './sql-table';
import {SqlExpression} from './sql-expression';
import {isKind} from '../utils/is-kind';

export interface SqlDelete {
  delete: SqlTable;
  where?: SqlExpression | null;
}

export const isSqlDelete = (val: any): val is SqlDelete => isKind<SqlDelete>(val, ['delete']);