import { getFieldFromSelector } from './utils';
import {
  RelationalEmptyExpressionBuilder,
  RelationalExpressionField,
} from './relational-empty-expression-builder';
import { RelationalExpressionBuilder } from './relational-expression-builder';
import { SqlSchemaTableField } from '../sql/sql-schema-table-field';
import { isSqlSchemaTable } from '../sql/sql-schema-table';
import { isSqlCompareExpression } from '../sql/expression/sql-compare-expression';
import { SqlExpression } from '../sql/expression';
import { SqlSelectFrom } from '../sql/select';
import { isSqlInExpression } from '../sql/expression/sql-in-expression';
import { isSqlAndExpression } from '../sql/expression/sql-and-expression';

export class RelationalEmptyExpressionBuilderImpl<T>
  implements RelationalEmptyExpressionBuilder<T> {
  constructor(private from: SqlSelectFrom | null | undefined) {}

  protected addExpression(
    expression: SqlExpression,
  ): RelationalExpressionBuilderImpl<T> {
    return new RelationalExpressionBuilderImpl<T>(this.from, expression);
  }

  or(
    action: (
      builder: RelationalEmptyExpressionBuilder<T>,
    ) => RelationalExpressionBuilder<T>,
  ) {
    const builder = action(
      new RelationalEmptyExpressionBuilderImpl<T>(this.from),
    );

    if (
      isSqlCompareExpression(builder.expression) ||
      isSqlInExpression(builder.expression)
    ) {
      return this.addExpression(builder.expression);
    } else {
      return this.addExpression({ or: [builder.expression] });
    }
  }

  private getField(field: RelationalExpressionField<T>): SqlSchemaTableField {
    if (typeof field === 'function') {
      return getFieldFromSelector(field);
    } else {
      return field;
    }
  }

  lte(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '<=' });
  }

  lt(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '<' });
  }

  gte(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '>=' });
  }

  gt(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '>' });
  }

  ne(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '!=' });
  }

  eq(
    first: RelationalExpressionField<T>,
    second: RelationalExpressionField<T>,
  ) {
    const left = this.addFrom(this.getField(first));
    const right = this.addFrom(this.getField(second));
    return this.addExpression({ left, right, operand: '=' });
  }

  private addFrom(field: SqlSchemaTableField): SqlSchemaTableField {
    if (field.table) {
      return field;
    }
    if (!this.from) {
      return field;
    }
    if (typeof this.from === 'string') {
      return { table: this.from, ...field };
    } else if (isSqlSchemaTable(this.from)) {
      if (this.from.schema) {
        return { table: this.from.table, schema: this.from.schema, ...field };
      } else {
        return { table: this.from.table, ...field };
      }
    }

    return field;
  }
}

export class RelationalExpressionBuilderImpl<T>
  extends RelationalEmptyExpressionBuilderImpl<T>
  implements RelationalExpressionBuilder<T> {
  constructor(
    from: SqlSelectFrom | null | undefined,
    public expression: SqlExpression,
  ) {
    super(from);
  }

  protected addExpression(
    expression: SqlExpression,
  ): RelationalExpressionBuilderImpl<T> {
    if (!this.expression) {
      this.expression = expression;
    } else {
      if (isSqlAndExpression(this.expression)) {
        this.expression.and.push(expression);
      } else {
        this.expression = { and: [this.expression, expression] };
      }
    }
    return this;
  }
}
