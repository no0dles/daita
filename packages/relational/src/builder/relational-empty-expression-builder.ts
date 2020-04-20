import { SqlRawValue } from '../sql/sql-raw-value';
import { RelationalExpressionBuilder } from './relational-expression-builder';
import { SqlSchemaTableField } from '../sql';
import { Full } from "@daita/common";

export type RelationalExpressionSelector<T> = (table: Full<T>) => SqlRawValue;
export type RelationalExpressionField<T> =
  | RelationalExpressionSelector<T>
  | SqlSchemaTableField;

export interface RelationalEmptyExpressionBuilder<T> {
  or(
    action: (
      builder: RelationalEmptyExpressionBuilder<T>,
    ) => RelationalExpressionBuilder<T>,
  ): RelationalExpressionBuilder<T>;

  ne(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;

  eq(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;

  lt(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;

  lte(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;

  gte(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;

  gt(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ): RelationalExpressionBuilder<T>;
}
