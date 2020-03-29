import {Full} from '../context/types/full';
import {SqlRawValue} from '../sql/sql-raw-value';
import {RelationalExpressionBuilder} from './relational-expression-builder';

export interface RelationalEmptyExpressionBuilder<T> {
  or(action: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>): RelationalExpressionBuilder<T>;
  ne(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>
  eq(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>
  lt(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>
  lte(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>;
  gte(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>
  gt(first: (table: Full<T>) => SqlRawValue, second: (table: Full<T>) => SqlRawValue): RelationalExpressionBuilder<T>
}

