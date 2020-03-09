import {SqlQuery} from './sql-query';
import {SqlSelect} from './sql-select';
import {SqlUpdate} from './sql-update';
import {SqlDelete} from './sql-delete';
import {SqlInsert} from './sql-insert';
import {SqlMinFunction} from './sql-min-function';
import {SqlFunction} from './sql-function';
import {SqlSelectJoinType} from './sql-select-join-type';
import {SqlSumFunction} from './sql-sum-function';
import {SqlMaxFunction} from './sql-max-function';
import {SqlConcatFunction} from './sql-concat-function';
import {SqlAvgFunction} from './sql-avg-function';
import {SqlOperand} from './sql-operand';
import {SqlAndExpression} from './sql-and-expression';
import {SqlExpression} from './sql-expression';
import {SqlOrExpression} from './sql-or-expression';
import {SqlRawValue} from './sql-raw-value';
import {SqlCompareExpression} from './sql-compare-expression';
import {SqlValue} from './sql-value';
import {SqlSelectField} from './sql-select-field';
import {SqlSchemaTableField} from './sql-schema-table-field';
import {SqlSelectFrom} from './sql-select-from';
import {SqlSelectJoin} from './sql-select-join';
import {SqlAlias} from './sql-alias';
import {SqlCountFunction} from './sql-count-function';
import {SqlSelectAll} from './sql-select-all';
import {SqlRawAliasValue} from './sql-raw-alias-value';
import {SqlSelectDistinct} from './sql-select-distinct';
import {SqlSchemaTable} from './sql-schema-table';
import {SqlBaseBuilder} from './sql-base-builder';
import {SqlInExpression} from './sql-in-expression';
import {SqlInOperand} from './sql-in-operand';

export class SqlQueryBuilder extends SqlBaseBuilder {
  sql = '';
  values: SqlRawValue[] = [];

  protected distinctKeyword = 'DISTINCT';
  protected groupByKeyword = 'GROUP BY';
  protected onKeyword = 'ON';
  protected selectKeyword = 'SELECT';
  protected fromKeyword = 'FROM';
  protected updateKeyword = 'UPDATE';
  protected deleteKeyword = 'DELETE';
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
    const quy = query as SqlSelect & SqlUpdate & SqlDelete & SqlInsert;
    if (quy.update) {
      this.sql = this.formatUpdate(quy);
    } else if (quy.select) {
      this.sql = this.formatSelect(quy);
    } else if (quy.delete) {
      this.sql = this.formatDelete(quy);
    } else if (quy.insert) {
      this.sql = this.formatInsert(quy);
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

    const selectAlias = table as SqlSelect & SqlAlias;
    if (selectAlias.select && selectAlias.alias) {
      return `(${this.formatSelect(selectAlias)}) ${this.asKeyword} ${this.escapeAlias(selectAlias.alias)}`;
    }

    const select = table as SqlSelect;
    if (select.select) {
      return `(${this.formatSelect(select)})`;
    }

    const tableAlias = table as SqlSchemaTable & SqlAlias;
    if (tableAlias.table) {
      return this.formatSchemaTableField(tableAlias.schema, tableAlias.table, undefined, tableAlias.alias);
    }

    throw new Error('unknown table');
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
      const groupBySql = select.groupBy.map(groupBy => {
        if (typeof groupBy === 'number') {
          return this.appendValue(groupBy);
        }
        return this.formatSchemaTableField(groupBy.schema, groupBy.table, groupBy.field);
      });
      sql += ` ${this.groupByKeyword} ${groupBySql.join(', ')}`;
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

  private formatJoin(join: SqlSelectJoin) {
    return `${this.escapeJoinType(join.type)} ${this.formatTable(join.from)} ${this.onKeyword} ${this.formatExpression(join.on, false)}`;
  }

  protected formatExpression(expression: SqlExpression, wrap: boolean): string {
    const expr = expression as SqlCompareExpression & SqlInExpression & SqlAndExpression & SqlOrExpression;

    if (expr.and) {
      return `${wrap ? '(' : ''}${expr.and.map(exp => this.formatExpression(exp, true)).join(` ${this.andKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (expr.or) {
      return `${wrap ? '(' : ''}${expr.or.map(exp => this.formatExpression(exp, true)).join(` ${this.orKeyword} `)}${wrap ? ')' : ''}`;
    }

    if (expr.value) {
      return `${this.formatValue(expr.left)} ${this.escapeInOperand(expr.operand, expr.value)}`;
    }

    return `${this.formatValue(expr.left)} ${this.escapeOperator(expr.operand)} ${this.formatValue(expr.right)}`;
  }


  protected formatFunction(fn: SqlFunction) {
    const func = fn as SqlCountFunction
      & SqlAvgFunction
      & SqlSumFunction
      & SqlMinFunction
      & SqlMaxFunction
      & SqlConcatFunction
      & SqlAlias;

    if (func.count) {
      const count = func.count as SqlSchemaTableField & SqlSelectAll & SqlSelectDistinct & SqlSchemaTable;

      if (count.distinct) {
        return this.escapeCount(`${this.distinctKeyword} ${this.formatSchemaTableField(count.schema, count.table, count.field, func.alias)}`);
      }
      if (count.field) {
        return this.escapeCount(this.formatSchemaTableField(count.schema, count.table, count.field, func.alias));
      }
      if (count.all) {
        if (count.table) {
          return this.escapeCount(`${this.formatSchemaTableField(count.schema, count.table)}.${this.allKeyword}`);
        } else {
          return this.escapeCount(this.allKeyword);
        }
      }
      throw new Error('unknown count function');
    }

    if (func.avg) {
      return this.escapeAvg(this.formatSchemaTableField(func.avg.schema, func.avg.table, func.avg.field, func.alias));
    }

    if (func.min) {
      return this.escapeMin(this.formatSchemaTableField(func.min.schema, func.min.table, func.min.field, func.alias));
    }

    if (func.max) {
      return this.escapeMax(this.formatSchemaTableField(func.max.schema, func.max.table, func.max.field, func.alias));
    }

    if (func.concat && func.concat instanceof Array) {
      return this.escapeConcat(func.concat);
    }

    return null;
  }

  protected formatValue(value: SqlValue): string | null {
    const val = value as SqlRawValue & SqlSelect & SqlAlias & SqlSchemaTableField & SqlFunction;
    if (typeof val === 'string' || typeof val === 'boolean' || typeof val === 'number' || val instanceof Date) {
      return this.appendValue(val);
    }

    const fnSql = this.formatFunction(val);
    if (fnSql) {
      return fnSql;
    }

    if (val.select && val.alias) {
      return `(${this.formatSelect(val)}) ${this.asKeyword} ${this.escapeAlias(val.alias)}`;
    }

    if (val.select) {
      return `(${this.formatSelect(val)})`;
    }

    if (val.field) {
      return this.formatSchemaTableField(undefined, val.table, val.field);
    }

    return null;
  }

  protected formatField(field: SqlSelectField): string {
    const fld = field as SqlSelectAll & SqlRawAliasValue & SqlValue & SqlFunction & SqlAlias & SqlSelect & SqlSchemaTableField;

    if (fld.value) {
      const param = this.appendValue(fld.value);
      return `${param} ${this.asKeyword} ${this.escapeAlias(fld.alias)}`;
    }

    if (fld.all) {
      const sql = this.formatSchemaTableField(fld.schema, fld.table);
      if (sql.length > 0) {
        return `${sql}.${this.allKeyword}`;
      }
      return this.allKeyword;
    }

    if (fld.field) {
      return this.formatSchemaTableField(fld.schema, fld.table, fld.field, fld.alias);
    }

    const valueSql = this.formatValue(fld);
    if (valueSql) {
      return valueSql;
    }

    throw new Error('unknown select field');
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
