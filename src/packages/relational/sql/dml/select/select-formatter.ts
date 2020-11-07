import { FormatHandle, Formatter, FormatType } from '../../../formatter/formatter';
import { FormatContext } from '../../../formatter/format-context';
import { isSelectSql, SelectSql } from './select-sql';

export class SelectFormatter implements FormatHandle<SelectSql<any>> {
  type = [FormatType.Sql, FormatType.Value];

  private formatFields(fields: any, ctx: FormatContext, formatter: Formatter, alias: string[]): string {
    if (formatter.canHandle(fields)) {
      if (alias.length > 0) {
        return `${formatter.format(fields, ctx)} AS ${ctx.escape(alias.join('.'))}`;
      } else {
        return formatter.format(fields, ctx);
      }
    } else {
      return Object.keys(fields)
        .map((key) => this.formatFields(fields[key], ctx, formatter, [...alias, key]))
        .join(', ');
    }
  }

  handle(param: SelectSql<any>, ctx: FormatContext, formatter: Formatter): string {
    let sql = 'SELECT';

    if (typeof param.select === 'object') {
      sql += ` ${this.formatFields(param.select, ctx, formatter, [])}`;
    } else {
      sql += ` ${formatter.format(param.select, ctx)}`;
    }

    if (param.from) {
      sql += ` FROM ${formatter.format(param.from, ctx)}`;
    }

    if (param.join) {
      sql += ` ${param.join.map((join) => formatter.format(join, ctx)).join(' ')}`;
    }

    if (param.where) {
      sql += ` WHERE ${formatter.format(param.where, ctx)}`;
    }

    if (param.groupBy) {
      sql += ` GROUP BY ${this.arrayOrSingle(param.groupBy, ctx, formatter)}`;
    }

    if (param.having) {
      sql += ` HAVING ${formatter.format(param.having, ctx)}`;
    }

    if (param.orderBy) {
      sql += ` ORDER BY ${this.arrayOrSingle(param.orderBy, ctx, formatter)}`;
    }

    if (param.limit !== null && param.limit !== undefined) {
      sql += ` LIMIT ${ctx.appendValue(param.limit)}`;
    }

    if (param.offset !== null && param.offset !== undefined) {
      sql += ` OFFSET ${ctx.appendValue(param.offset)}`;
    }

    return sql;
  }

  private arrayOrSingle(param: any[] | any, ctx: FormatContext, formatter: Formatter) {
    if (param instanceof Array) {
      return param.map((order: any) => formatter.format(order, ctx)).join(', ');
    } else {
      return formatter.format(param, ctx);
    }
  }

  canHandle(param: any): boolean {
    return isSelectSql(param);
  }
}
