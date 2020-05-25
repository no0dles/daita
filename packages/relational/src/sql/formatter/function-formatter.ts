import { isSqlSchemaTableField } from '../sql-schema-table-field';
import { isSqlSchemaTable } from '../sql-schema-table';
import { failNever } from '@daita/common';
import { SqlFunction } from '../dml/function';
import { isSqlConcatFunction } from '../dml/function/sql-concat-function';
import { isSqlSelectAll } from '../dml/select/sql-select-all';
import { isSqlSumFunction } from '../dml/function/sql-sum-function';
import { isSqlMaxFunction } from '../dml/function/sql-max-function';
import { isSqlMinFunction } from '../dml/function/sql-min-function';
import { isSqlSelectDistinct } from '../dml/select/sql-select-distinct';
import { isSqlCountFunction } from '../dml/function/sql-count-function';
import { isSqlAvgFunction } from '../dml/function/sql-avg-function';
import { SqlValue } from '../dml/sql-value';
import { isSqlAlias } from '../dml/select';
import { Formatter, FormatterHandler } from './formatter';
import { isSqlFunction } from '../dml/function/sql-function';
import { FormatContext } from './format-context';

export interface FunctionFormatterOptions {
  distinctKeyword: string // "DISTINCT"
  allKeyword: string // "*"
}

export interface FormatFunction {
  function: SqlFunction;
}

export class FunctionFormatter implements FormatterHandler {

  constructor(private options: FunctionFormatterOptions) {
  }

  formatFunction(fn: SqlFunction, ctx: FormatContext, formatter: Formatter): string {
    let alias: string | undefined;

    if (isSqlAlias(fn)) {
      alias = fn.alias;
    }

    if (isSqlCountFunction(fn)) {
      if (isSqlSelectDistinct(fn.count)) {
        return this.escapeCount(
          `${this.options.distinctKeyword} ${formatter.format({
            field: {
              schema: fn.count.schema,
              table: fn.count.table,
              field: fn.count.field,
              alias,
            },
          }, ctx)}`,
        );
      }
      if (isSqlSchemaTableField(fn.count)) {
        return this.escapeCount(
          formatter.format({
            field: {
              schema: fn.count.schema,
              table: fn.count.table,
              field: fn.count.field,
              alias,
            },
          }, ctx),
        );
      }
      if (isSqlSelectAll(fn.count)) {
        if (isSqlSchemaTable(fn.count)) {
          return this.escapeCount(
            `${formatter.format({ field: { schema: fn.count.schema, table: fn.count.table } }, ctx)}.${
              this.options.allKeyword
            }`,
          );
        } else {
          return this.escapeCount(this.options.allKeyword);
        }
      }

      failNever(fn.count, 'unknown sql count function');
    }

    if (isSqlSumFunction(fn)) {
      return this.escapeSum(
        formatter.format({
          field: {
            schema: fn.sum.schema,
            table: fn.sum.table,
            field: fn.sum.field,
            alias,
          },
        }, ctx),
      );
    }

    if (isSqlAvgFunction(fn)) {
      return this.escapeAvg(
        formatter.format({
          field: {
            schema: fn.avg.schema,
            table: fn.avg.table,
            field: fn.avg.field,
            alias,
          },
        }, ctx),
      );
    }

    if (isSqlMinFunction(fn)) {
      return this.escapeMin(
        formatter.format({
          field: {
            schema: fn.min.schema,
            table: fn.min.table,
            field: fn.min.field,
            alias,
          },
        }, ctx),
      );
    }

    if (isSqlMaxFunction(fn)) {
      return this.escapeMax(
        formatter.format({
          field: {
            schema: fn.max.schema,
            table: fn.max.table,
            field: fn.max.field,
            alias,
          },
        }, ctx),
      );
    }

    if (isSqlConcatFunction(fn)) {
      return this.escapeConcat(fn.concat, ctx, formatter);
    }

    failNever(fn, 'unknown sql function');
  }

  escapeCount(value: string): string {
    return `count(${value})`;
  }

  escapeSum(value: string): string {
    return `sum(${value})`;
  }

  escapeMax(value: string): string {
    return `max(${value})`;
  }

  escapeMin(value: string): string {
    return `min(${value})`;
  }

  escapeAvg(value: string): string {
    return `avg(${value})`;
  }

  escapeConcat(values: SqlValue[], ctx: FormatContext, formatter: Formatter): string {
    return `concat(${values
      .map((value) => formatter.format({ value }, ctx))
      .join(', ')})`;
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlFunction(param.function)) {
      return this.formatFunction(param.function, ctx, formatter);
    }
    return null;
  }
}
