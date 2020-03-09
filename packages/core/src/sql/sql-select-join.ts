import {SqlSelectJoinType} from './sql-select-join-type';
import {SqlSelectFrom} from './sql-select-from';
import {SqlExpression} from './sql-expression';

export interface SqlSelectJoin {
  type: SqlSelectJoinType;
  from: SqlSelectFrom;
  on: SqlExpression;
}
