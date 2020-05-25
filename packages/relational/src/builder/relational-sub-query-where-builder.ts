import { SqlWhereQuery } from '../sql/dml/sql-where-query';
import { QueryFilter } from '../query';
import { RelationalWhereBuilder } from './relational-where-builder';
import {
  SqlAndExpression,
  SqlCompareExpression,
  SqlInExpression,
  SqlOrExpression,
} from '../sql/dml/expression';

export abstract class RelationalSubQueryWhereBuilder<
  T,
  TQuery extends SqlWhereQuery,
  Result
> extends RelationalWhereBuilder<T, TQuery, Result> {
  protected parseFilter(
    data: QueryFilter<T>,
    path: string[] = [],
  ):
    | SqlCompareExpression
    | SqlInExpression
    | SqlAndExpression
    | SqlOrExpression {
    if (path.length > 0) {
      throw new Error('not supported yet');
    }
    return super.parseFilter(data, path);
  }
}
