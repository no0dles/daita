import {
  isSqlAlias, SqlOrderDirection,
  SqlSelect, SqlSelectField,
  SqlSelectFrom,
  SqlSelectGroupBy,
  SqlSelectJoin,
  SqlSelectJoinType,
  SqlSelectOrderBy,
} from '../dml/select';
import { isSqlSchemaTable } from '../sql-schema-table';
import { failNever } from '@daita/common';
import { isSqlSchemaTableField } from '../sql-schema-table-field';
import { isSqlSelectOrderByIndex } from '../dml/select/sql-select-order-by-index';
import { isSqlSelect } from '../dml/select/sql-select';
import { Formatter, FormatterHandler } from './formatter';
import { FormatContext } from './format-context';
import { isSqlRawAliasValue } from '../dml/sql-raw-alias-value';
import { isSqlSelectAll } from '../dml/select/sql-select-all';
import { isSqlFunction } from '../dml/function/sql-function';
import { isSqlRawValue } from '../dml/sql-raw-value';

export interface SelectFormatterOptions {
  onKeyword: string // ON
  havingKeyword: string // "HAVING";
  offsetKeyword: string // "OFFSET";
  limitKeyword: string // "LIMIT";
  groupByKeyword: string // "GROUP BY";
  orderByKeyword: string // "ORDER BY";
  selectKeyword: string // "SELECT";
  fromKeyword: string // "FROM";
  ascKeyword: string; //ASC
  descKeyword: string; //DESC
}

export class SelectFormatter implements FormatterHandler {
  constructor(private options: SelectFormatterOptions) {
  }

  formatSelect(select: SqlSelect, ctx: FormatContext, formatter: Formatter): string {
    let sql = `${this.options.selectKeyword} ${select.select
      .map((s) => this.formatField(s, ctx, formatter))
      .join(', ')}`.trim();
    if (select.from) {
      sql += ` ${this.options.fromKeyword} ${this.formatFrom(select.from, ctx, formatter)}`;
    }

    if (select.joins) {
      for (const join of select.joins) {
        sql += ` ${this.formatJoin(join, ctx, formatter)}`;
      }
    }

    sql += formatter.format({ expression: select.where }, ctx);

    if (select.groupBy && select.groupBy.length > 0) {
      sql += ` ${this.options.groupByKeyword} ${select.groupBy
        .map((groupBy) => this.formatGroupBy(groupBy, ctx, formatter))
        .join(', ')}`;
    }

    if (select.orderBy && select.orderBy.length > 0) {
      sql += ` ${this.options.orderByKeyword} ${select.orderBy
        .map((orderBy) => this.formatOrderBy(orderBy, ctx, formatter))
        .join(', ')}`;
    }

    if (select.having) {
      sql += ` ${this.options.havingKeyword} ${formatter.format({ condition: select.having }, ctx)}`;
    }

    if (select.limit !== null && select.limit !== undefined) {
      sql += ` ${this.options.limitKeyword} ${ctx.appendValue(select.limit)}`;
    }

    if (select.offset !== null && select.offset !== undefined) {
      sql += ` ${this.options.offsetKeyword} ${ctx.appendValue(select.offset)}`;
    }

    return sql;
  }

  formatJoin(join: SqlSelectJoin, ctx: FormatContext, formatter: Formatter): string {
    return `${this.escapeJoinType(join.type, ctx)} ${this.formatFrom(join.from, ctx, formatter)} ${
      this.options.onKeyword
    } ${formatter.format({ condition: join.on }, ctx)}`;
  }

  formatFrom(table: SqlSelectFrom, ctx: FormatContext, formatter: Formatter): string {
    if (typeof table === 'string') {
      return formatter.format({ table: table }, ctx);
    }

    if (isSqlSelect(table)) {
      let sql = formatter.format(table, ctx);
      if (isSqlAlias(table)) {
        return formatter.format({ alias: { name: table.alias, value: `(${sql})` } }, ctx);
      } else {
        return `(${sql})`;
      }
    }

    if (isSqlSchemaTable(table)) {
      if (isSqlAlias(table)) {
        return formatter.format({
          field: {
            schema: table.schema,
            table: table.table,
            alias: table.alias,
          },
        }, ctx);
      } else {
        return formatter.format({
          field: {
            schema: table.schema,
            table: table.table,
          },
        }, ctx);
      }
    }

    failNever(table, 'unknown table');
  }

  formatField(field: SqlSelectField, ctx: FormatContext, formatter: Formatter): string {
    let alias: string | undefined;

    if (isSqlAlias(field)) {
      alias = field.alias;
    }

    if (isSqlRawValue(field)) {
      return formatter.format({ value: field }, ctx);
    }

    if (isSqlRawAliasValue(field)) {
      const value = ctx.appendValue(field.value);
      return formatter.format({ alias: { name: field.alias, value: value } }, ctx);
    }

    if (isSqlFunction(field)) {
      return formatter.format({ function: field }, ctx);
    }

    if (isSqlSelect(field)) {
      const sql = `(${formatter.format(field, ctx)})`;

      if (alias) {
        return formatter.format({ alias: { name: alias, value: sql } }, ctx);
      } else {
        return sql;
      }
    }

    if (isSqlSchemaTableField(field) || isSqlSelectAll(field)) {
      return formatter.format({ field: field }, ctx);
    }

    failNever(field, 'unknown field');
  }

  formatGroupBy(groupBy: SqlSelectGroupBy, ctx: FormatContext, formatter: Formatter): string {
    if (typeof groupBy === 'number') {
      return ctx.appendValue(groupBy);
    }
    return formatter.format({
      field: {
        schema: groupBy.schema,
        table: groupBy.table,
        field: groupBy.field,
      },
    }, ctx);
  }

  formatOrderBy(orderBy: SqlSelectOrderBy, ctx: FormatContext, formatter: Formatter): string {
    if (typeof orderBy === 'number') {
      return ctx.appendValue(orderBy);
    }
    if (isSqlSelectOrderByIndex(orderBy)) {
      return `${ctx.appendValue(orderBy.index)} ${
        orderBy.direction ? this.escapeOrderDirection(orderBy.direction, ctx) : ''
      }`.trim();
    }
    if (isSqlSchemaTableField(orderBy)) {
      return `${formatter.format({
        field: {
          schema: orderBy.schema,
          table: orderBy.table,
          field: orderBy.field,
        },
      }, ctx)} ${
        orderBy.direction ? this.escapeOrderDirection(orderBy.direction, ctx) : ''
      }`.trim();
    }

    failNever(orderBy, 'unknown order by');
  }

  escapeJoinType(joinType: SqlSelectJoinType, ctx: FormatContext): string {
    switch (joinType) {
      case 'left':
        return 'LEFT JOIN';
      case 'right':
        return 'RIGHT JOIN';
      case 'full':
        return 'FULL JOIN';
      case 'inner':
        return 'JOIN';
      case 'cross':
        return 'CROSS JOIN';
    }
  }

  escapeOrderDirection(direction: SqlOrderDirection, ctx: FormatContext): string {
    switch (direction) {
      case 'asc':
        return this.options.ascKeyword;
      case 'desc':
        return this.options.descKeyword;
    }
  }

  handle(param: any, ctx: FormatContext, formatter: Formatter): string | null {
    if (isSqlSelect(param)) {
      return this.formatSelect(param, ctx, formatter);
    }

    return null;
  }
}


//
// if (isSqlSelectAll(param.field)) {
//   if (isSqlSchemaTable(param.field)) {
//     return `${this.formatSchemaTableField(
//       formatter,
//       ctx, param.field.schema, param.field.table)}.${
//       this.options.allKeyword
//     }`;
//   } else {
//     return this.options.allKeyword;
//   }
// }
//
// if (isSqlSchemaTableField(param.field)) {
//   let alias;
//   if (isSqlAlias(param.field)) {
//     alias = param.field.alias;
//   }
//   return this.formatSchemaTableField(
//     formatter,
//     ctx,
//     param.field.schema,
//     param.field.table,
//     param.field.field,
//     alias,
//   );
// }
//
// if (isSqlValue(param.field)) {
//   if (isSqlAlias(param.field)) {
//     return formatter.format({ alias: param.field.alias, value: formatter.format({ value: param.field }, ctx) }, ctx);
//   } else {
//     return formatter.format({ value: param.field }, ctx);
//   }
// }
