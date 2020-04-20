import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {TableInformation} from './table-information';
import {
  failNever, isSqlAndExpression,
  isSqlCompareExpression, isSqlInExpression,
  isSqlOrExpression, isSqlSchemaTableField, RelationalQueryBuilder,
  SqlExpression,
  SqlSchemaTableField,
  SqlValue
} from "@daita/core";

export class RelationalSchemaBaseContext<Query extends RelationalQueryBuilder<any, Result>, Result> implements Promise<Result> {
  [Symbol.toStringTag]: 'Promise';

  constructor(protected builder: Query, //RelationalQueryBuilder<any, Result>,
              protected type: TableInformation<any>,
              protected schema: RelationalSchemaDescription) {

  }

  protected getBuilderQuery<TQuery extends object>(builder: RelationalQueryBuilder<TQuery, Result>): TQuery {
    return (<any>builder).query;
  }

  protected mapExpressionFields(expression: SqlExpression) {
    if (isSqlAndExpression(expression)) {
      for (const subExpression of expression.and) {
        this.mapExpressionFields(subExpression);
      }
    } else if (isSqlOrExpression(expression)) {
      for (const subExpression of expression.or) {
        this.mapExpressionFields(subExpression);
      }
    } else if (isSqlCompareExpression(expression)) {
      this.mapValue(expression.right);
      this.mapValue(expression.left);
    } else if (isSqlInExpression(expression)) {
      this.mapValue(expression.left);
    } else {
      failNever(expression, 'unknown expression');
    }
  }

  protected mapTableField(value: SqlSchemaTableField) {
    if (!value.table || value.table === 'base') {
      const table = this.schema.table(this.type);
      value.field = table.field(value.field).name;
    } else {
      let table = this.schema.table(this.type);
      const parts = value.table.split('.');
      for (const part of parts) {
        table = table.reference(part).table;
      }
      value.field = table.field(value.field).name;
    }
  }

  protected mapValue(value: SqlValue) {
    if (isSqlSchemaTableField(value)) {
      this.mapTableField(value);
    }
  }

  protected execute(): Promise<Result> {
    return this.builder;
  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<Result | TResult> {
    return this.execute().catch(onrejected);
  }

  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<Result> {
    return this.execute().finally(onfinally);
  }
}
