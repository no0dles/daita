import {SqlTable} from './sql-table';
import {SqlExpression} from './sql-expression';

export interface SqlDelete {
  delete: SqlTable;
  where?: SqlExpression | null;
}