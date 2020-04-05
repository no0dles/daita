import {RelationalQueryBuilder} from '../builder/relational-query-builder';
import {SqlExpression} from '../sql/expression';
import {isSqlAndExpression} from '../sql/expression/sql-and-expression';
import {isSqlOrExpression} from '../sql/expression/sql-or-expression';
import {isSqlCompareExpression} from '../sql/expression/sql-compare-expression';
import {isSqlInExpression} from '../sql/expression/sql-in-expression';
import {SqlSchemaTableField, SqlValue} from '../sql';
import {getSqlTable} from '../builder/utils';
import {isSqlSchemaTableField} from '../sql/sql-schema-table-field';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {TableInformation} from './table-information';

export class RelationalSchemaBaseContext<Result> implements Promise<Result> {
  [Symbol.toStringTag]: 'Promise';

  constructor(private queryBuilder: RelationalQueryBuilder<any, Result>,
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
    if (value.table) {
      let table = this.schema.table(this.type);
      const parts = value.table.split('.');
      if (parts.length === 1 && getSqlTable(this.type).table === parts[0]) {

      } else {
        for (const part of parts) {
          table = table.reference(part).table;
        }
      }
      value.field = table.field(value.field).name;
    } else {
      const table = this.schema.table(this.type);
      value.field = table.field(value.field).name;
    }
  }

  protected mapValue(value: SqlValue) {
    if (isSqlSchemaTableField(value)) {
      this.mapTableField(value);
    }
  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<Result | TResult> {
    return this.queryBuilder.catch(onrejected);
  }

  then<TResult1 = Result, TResult2 = never>(onfulfilled?: ((value: Result) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
    return this.queryBuilder.then(onfulfilled, onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<Result> {
    return this.queryBuilder.finally(onfinally);
  }
}
