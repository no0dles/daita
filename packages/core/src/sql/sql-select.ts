import {SqlExpression} from './sql-expression';
import {SqlSelectGroupBy} from './sql-select-group-by';
import {SqlSelectField} from './sql-select-field';
import {SqlCompareExpression} from './sql-compare-expression';
import {SqlSelectFrom} from './sql-select-from';
import {SqlSelectJoin} from './sql-select-join';
import {SqlSelectOrderBy} from './sql-select-order-by';
import {isKind} from '../utils/is-kind';
import {SqlUpdate} from './sql-update';

export interface SqlSelect {
  select: SqlSelectField[];
  from?: SqlSelectFrom | null;
  joins?: SqlSelectJoin[] | null;
  where?: SqlExpression | null;
  orderBy?: SqlSelectOrderBy[] | null;
  groupBy?: SqlSelectGroupBy[] | null;
  having?: SqlCompareExpression | null;
  limit?: number | null;
  offset?: number | null;
}

export const isSqlSelect = (val: any): val is SqlSelect => isKind<SqlSelect>(val, ['select']);