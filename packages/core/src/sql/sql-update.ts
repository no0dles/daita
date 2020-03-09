import {SqlTable} from './sql-table';
import {SqlExpression} from './sql-expression';
import {SqlUpdateSet} from './sql-update-set';

export interface SqlUpdate {
  update: SqlTable;
  set: {
    [key: string]: SqlUpdateSet;
  }
  where?: SqlExpression | null;
}
