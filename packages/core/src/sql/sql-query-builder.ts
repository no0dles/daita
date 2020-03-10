import {SqlQuery} from './sql-query';
import {isSqlSelect, SqlSelect} from './sql-select';
import {isSqlUpdate, SqlUpdate} from './sql-update';
import {isSqlDelete, SqlDelete} from './sql-delete';
import {isSqlInsert, SqlInsert} from './sql-insert';
import {isSqlMinFunction} from './sql-min-function';
import {isSqlFunction, SqlFunction} from './sql-function';
import {SqlSelectJoinType} from './sql-select-join-type';
import {isSqlSumFunction} from './sql-sum-function';
import {isSqlMaxFunction} from './sql-max-function';
import {isSqlConcatFunction} from './sql-concat-function';
import {isSqlAvgFunction} from './sql-avg-function';
import {SqlOperand} from './sql-operand';
import {isSqlAndExpression} from './sql-and-expression';
import {SqlExpression} from './sql-expression';
import {isSqlOrExpression} from './sql-or-expression';
import {isSqlRawValue, SqlRawValue} from './sql-raw-value';
import {isSqlCompareExpression} from './sql-compare-expression';
import {isSqlValue, SqlValue} from './sql-value';
import {SqlSelectField} from './sql-select-field';
import {isSqlSchemaTableField, SqlSchemaTableField} from './sql-schema-table-field';
import {SqlSelectFrom} from './sql-select-from';
import {SqlSelectJoin} from './sql-select-join';
import {isSqlAlias, SqlAlias} from './sql-alias';
import {isSqlCountFunction} from './sql-count-function';
import {isSqlSelectAll} from './sql-select-all';
import {isSqlRawAliasValue} from './sql-raw-alias-value';
import {isSqlSelectDistinct} from './sql-select-distinct';
import {isSqlSchemaTable} from './sql-schema-table';
import {SqlBaseBuilder} from './sql-base-builder';
import {isSqlInExpression} from './sql-in-expression';
import {SqlInOperand} from './sql-in-operand';
import {SqlOrderDirection} from './sql-order-direction';
import {assertNever} from '../utils/assert-never';
import {isSqlSelectOrderByIndex} from './sql-select-order-by-index';
import {SqlSelectOrderBy} from './sql-select-order-by';
import {SqlSelectGroupBy} from './sql-select-group-by';

export class SqlQueryBuilder extends SqlBaseBuilder {
  sql = '';
  values: SqlRawValue[] = [];

  protected distinctKeyword = 'DISTINCT';
  protected groupByKeyword = 'GROUP BY';
  protected orderByKeyword = 'ORDER BY';
  protected onKeyword = 'ON';
  protected selectKeyword = 'SELECT';
  protected fromKeyword = 'FROM';
  protected updateKeyword = 'UPDATE';
  protected deleteKeyword = 'DELETE FROM';
  protected insertKeyword = 'INSERT INTO';
  protected valuesKeyword = 'VALUES';
  protected setKeyword = 'SET';
  protected allKeyword = '*';
  protected whereKeyword = 'WHERE';
  protected andKeyword = 'AND';
  protected orKeyword = 'OR';
  protected havingKeyword = 'HAVING';
  protected offsetKeyword = 'OFFSET';
  protected limitKeyword = 'LIMIT';

  constructor(query: SqlQuery) {
    super();
    if (isSqlUpdate(query)) {
      this.sql = this.formatUpdate(query);
    } else if (isSqlSelect(query)) {
      this.sql = this.formatSelect(query);
    } else if (isSqlDelete(query)) {
      this.sql = this.formatDelete(query);
    } else if (isSqlInsert(query)) {
      this.sql = this.formatInsert(query);
    } else {
      assertNever(query, 'unknown query');
    }
  }

  protected appendValue(value: SqlRawValue) {
    const index = this.values.indexOf(value);
    if (index >= 0) {
      return `$${index + 1}`;
    }
    this.values.push(value);
    return `$${this.values.length}`;
  }

  protected formatTable(table: SqlSelectFrom) {
    if (typeof table === 'string') {
      return this.escapeTable(table);
    }

    if (isSqlSelect(table)) {
      if (isSqlAlias(table)) {
        return `(${this.formatSelect(table)}) ${this.asKeyword} ${this.escapeAlias(table.alias)}`;
      } else {
        return `(${this.formatSelect(table)})`;
      }
    }

    if (isSqlSchemaTable(table)) {
      if (isSqlAlias(table)) {
        return this.formatSchemaTableField(table.schema, table.table, undefined, table.alias);
      } else {
        return this.formatSchemaTableField(table.schema, table.table, undefined, undefined);
      }
    }

    assertNever(table, 'unknown table');
  }

  protected formatUpdate(update: SqlUpdate) {
    let sql = `${this.updateKeyword} ${this.formatTable(update.update)} ${this.setKeyword} `;

    sql += Object.keys(update.set).map(key => {
      return `${this.escapeField(key)} = ${this.formatValue(update.set[key])}`;
    }).join(', ');

    if (update.where) {
      sql += ` ${this.whereKeyword} ${this.formatExpression(update.where, false)}`;
    }

    return sql;
  }

  protected formatDelete(del: SqlDelete) {
    let sql = `${this.deleteKeyword} ${this.formatTable(del.delete)}`;

    if (del.where) {
      sql += ` ${this.whereKeyword} ${this.formatExpression(del.where, false)}`;
    }

    return sql;
  }

  protected formatInsert(insert: SqlInsert) {
    let sql = `${this.insertKeyword} ${this.formatTable(insert.insert)}`;

    sql += ` (${insert.into.map(into => this.escapeField(into)).join(', ')})`;

    if (insert.values instanceof Array) {
      sql += ` ${this.valuesKeyword} `;
      const values: any[][] = [];
      for (const value of insert.values) {
        if (value instanceof Array) {
          values.push(value);
        }
      }
      if (values.length === 0) {
        values.push(insert.values);
      }

      sql += values.map(value => `(${value.map(value => this.formatValue(value)).join(', ')})`).join(', ');
    } else if (insert.values.select) {
      sql += ' ' + this.formatSelect(insert.values);
    }

    return sql;
  }

  protected formatSelect(select: SqlSelect) {
    let sql = `${this.selectKeyword} ${select.select.map(s => this.formatField(s)).join(', ')}`.trimRight();
    if (select.from) {
      sql += ` ${this.fromKeyword} ${this.formatTable(select.from)}`;
    }

    if (select.joins) {
      for (const join of select.joins) {
        sql += ` ${this.formatJoin(join)}`;
      }
    }

    if (select.where) {
      sql += ` ${this.whereKeyword} ${this.formatExpression(select.where, false)}`;
    }

    if (select.groupBy && select.groupBy.length > 0) {
      sql += ` ${this.groupByKeyword} ${select.groupBy.map(groupBy => this.formatGroupBy(groupBy)).join(', ')}`;
    }

    if (select.orderBy && select.orderBy.length > 0) {
      sql += ` ${this.orderByKeyword} ${select.orderBy.map(orderBy => this.formatOrderBy(orderBy)).join(', ')}`;
    }

    if (select.having) {
      sql += ` ${this.havingKeyword} ${this.formatExpression(select.having, false)}`;
    }

    if (select.limit !== null && select.limit !== undefined) {
      sql += ` ${this.limitKeyword} ${this.appendValue(select.limit)}`;
    }

    if (select.offset !== null && select.offset !== undefined) {
      sql += ` ${this.offsetKeyword} ${this.appendValue(select.offset)}`;
    }

    return sql;
  }

  protected formatGroupBy(groupBy: SqlSelectGroupBy) {
    if (typeof groupBy === 'number') {
      return this.appendValue(groupBy);
    }
    return this.formatSchemaTableField(groupBy.schema, groupBy.table, groupBy.field);
  }

  protected formatOrderBy(orderBy: SqlSelectOrderBy) {
    if (typeof orderBy === 'number') {
      return this.appendValue(orderBy);
    }
    if (isSqlSelectOrderByIndex(orderBy)) {
      return `${this.appendValue(orderBy.index)} ${orderBy.direction ? this.escapeOrderDirection(orderBy.direction) : ''}`.trimRight();
    }
    if (isSqlSchemaTableField(orderBy)) {
      return `${this.formatSchemaTableField(orderBy.schema, orderBy.table, orderBy.field)} ${orderBy.direction ? this.escapeOrderDirection(orderBy.direction) : ''}`.trimRight();
    }

    assertNever(orderBy, 'unknown order by');
  }

  protected formatJoin(join: SqlSelectJoin) {
    return `${this.escapeJoinType(join.type)} ${this.formatTable(join.from)} ${this.onKeyword} ${this.formatExpression(join.on, false)}`;
  }

  protected formatExpression(expression: SqlExpression, wrap: boolean): string {
    if (isSqlAndExpression(expression)) {
      return `${wrap ? '(' : ''}${expression.and.map(exp => this.formatExpression(exp, true)).join(` ${this.andKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (isSqlOrExpression(expression)) {
      return `${wrap ? '(' : ''}${expression.or.map(exp => this.formatExpression(exp, true)).join(` ${this.orKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (isSqlInExpression(expression)) {
      return `${this.formatValue(expression.left)} ${this.escapeInOperand(expression.operand, expression.value)}`;
    }

    if (isSqlCompareExpression(expression)) {
      return `${this.formatValue(expression.left)} ${this.escapeOperator(expression.operand)} ${this.formatValue(expression.right)}`;
    }

    assertNever(expression, 'unknown sql expression');
  }

  protected formatFunction(fn: SqlFunction) {
    let alias: string | undefined = undefined;

    if (isSqlAlias(fn)) {
      alias = fn.alias;
    }

    if (isSqlCountFunction(fn)) {
      if (isSqlSelectDistinct(fn.count)) {
        return this.escapeCount(`${this.distinctKeyword} ${this.formatSchemaTableField(fn.count.schema, fn.count.table, fn.count.field, alias)}`);
      }
      if (isSqlSchemaTableField(fn.count)) {
        return this.escapeCount(this.formatSchemaTableField(fn.count.schema, fn.count.table, fn.count.field, alias));
      }
      if (isSqlSelectAll(fn.count)) {
        if (isSqlSchemaTable(fn.count)) {
          return this.escapeCount(`${this.formatSchemaTableField(fn.count.schema, fn.count.table)}.${this.allKeyword}`);
        } else {
          return this.escapeCount(this.allKeyword);
        }
      }

      assertNever(fn.count, 'unknown sql count function');
    }

    if (isSqlSumFunction(fn)) {
      return this.escapeSum(this.formatSchemaTableField(fn.sum.schema, fn.sum.table, fn.sum.field, alias));
    }

    if (isSqlAvgFunction(fn)) {
      return this.escapeAvg(this.formatSchemaTableField(fn.avg.schema, fn.avg.table, fn.avg.field, alias));
    }

    if (isSqlMinFunction(fn)) {
      return this.escapeMin(this.formatSchemaTableField(fn.min.schema, fn.min.table, fn.min.field, alias));
    }

    if (isSqlMaxFunction(fn)) {
      return this.escapeMax(this.formatSchemaTableField(fn.max.schema, fn.max.table, fn.max.field, alias));
    }

    if (isSqlConcatFunction(fn)) {
      return this.escapeConcat(fn.concat);
    }

    assertNever(fn, 'unknown sql function');
  }

  protected formatValue(value: SqlValue): string {
    if (isSqlRawValue(value)) {
      return this.appendValue(value);
    }

    if (isSqlFunction(value)) {
      return this.formatFunction(value);
    }

    if (isSqlSelect(value)) {
      if (isSqlAlias(value)) {
        return `(${this.formatSelect(value)}) ${this.asKeyword} ${this.escapeAlias(value.alias)}`;
      } else {
        return `(${this.formatSelect(value)})`;
      }
    }

    if (isSqlSchemaTableField(value)) {
      return this.formatSchemaTableField(value.schema, value.table, value.field);
    }

    assertNever(value, 'unknown value');
  }

  protected formatField(field: SqlSelectField): string {
    if (isSqlRawAliasValue(field)) {
      const param = this.appendValue(field.value);
      return `${param} ${this.asKeyword} ${this.escapeAlias(field.alias)}`;
    }

    if (isSqlSelectAll(field)) {
      if (isSqlSchemaTable(field)) {
        return `${this.formatSchemaTableField(field.schema, field.table)}.${this.allKeyword}`;
      } else {
        return this.allKeyword;
      }
    }

    if (isSqlSchemaTableField(field)) {
      let alias = undefined;
      if (isSqlAlias(field)) {
        alias = field.alias;
      }
      return this.formatSchemaTableField(field.schema, field.table, field.field, alias);
    }

    if (isSqlValue(field)) {
      return this.formatValue(field);
    }

    assertNever(field, 'unknown select field');
  }

  protected escapeOrderDirection(direction: SqlOrderDirection): string {
    switch (direction) {
      case 'asc':
        return 'ASC';
      case 'desc':
        return 'DESC';
    }
  }

  protected escapeJoinType(joinType: SqlSelectJoinType): string {
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

  protected escapeOperator(operatorType: SqlOperand): string {
    switch (operatorType) {
      case '!=':
        return '!=';
      case '<':
        return '<';
      case '>':
        return '>';
      case 'like':
        return 'LIKE';
      case '>=':
        return '>=';
      case '<=':
        return '<=';
      case '=':
        return '=';
    }
  }

  protected escapeInOperand(inOperand: SqlInOperand, value: SqlRawValue[] | SqlSelect): string {
    if (value instanceof Array) {
      const values = value.map(value => this.formatValue(value)).join(', ');
      switch (inOperand) {
        case 'in':
          return `IN (${values})`;
        case 'not in':
          return `NOT IN (${values})`;
      }
    } else {
      switch (inOperand) {
        case 'in':
          return `IN (${this.formatSelect(value)})`;
        case 'not in':
          return `NOT IN (${this.formatSelect(value)})`;
      }
    }
  }

  protected escapeCount(value: string) {
    return `count(${value})`;
  }

  protected escapeSum(value: string) {
    return `sum(${value})`;
  }

  protected escapeAvg(value: string) {
    return `avg(${value})`;
  }

  protected escapeMin(value: string) {
    return `min(${value})`;
  }

  protected escapeMax(value: string) {
    return `max(${value})`;
  }

  protected escapeConcat(values: SqlValue[]) {
    return `concat(${values.map(value => this.formatValue(value)).join(', ')})`;
  }
}
