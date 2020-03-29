import {isSqlRawValue, SqlRawValue} from '../sql/sql-raw-value';
import {isAndRootFilter} from '../query/and-root-filter';
import {isOrRootFilter} from '../query/or-root-filter';
import {deepClone} from './utils';
import {SqlWhereQuery} from '../sql/sql-where-query';
import {RelationalQueryBuilder} from './relational-query-builder';
import {QueryFilter, RootFilter} from '../query';
import {SqlSchemaTableField} from '../sql/sql-schema-table-field';
import {SqlCompareExpression, SqlExpression, SqlInExpression, SqlInOperand, SqlOperand} from '../sql/expression';
import {isSqlOrExpression} from '../sql/expression/sql-or-expression';
import {isSqlAndExpression} from '../sql/expression/sql-and-expression';

export abstract class RelationalWhereBuilder<TData, TQuery extends SqlWhereQuery, Result> extends RelationalQueryBuilder<TQuery, Result> {

  private createCompareExpression(path: string[], field: string, value: SqlRawValue, operand: SqlOperand): SqlCompareExpression {
    const tableField: SqlSchemaTableField = {field};
    if(path.length > 0) {
      tableField.table = path.join('.');
    }
    return {
      left: tableField,
      operand,
      right: value,
    };
  }

  private createInExpression(path: string[], field: string, value: SqlRawValue[], operand: SqlInOperand): SqlInExpression {
    const tableField: SqlSchemaTableField = {field};
    if(path.length > 0) {
      tableField.table = path.join('.');
    }
    return {
      left: tableField,
      operand,
      value,
    };
  }

  protected parseFilter(data: QueryFilter<TData>, path: string[] = []): SqlExpression {
    const conditions: SqlExpression[] = [];
    const fieldKeys = Object.keys(data);

    for (const fieldKey of fieldKeys) {
      const fieldValue = (data as any)[fieldKey];
      if (isSqlRawValue(fieldValue)) {
        conditions.push(this.createCompareExpression(path, fieldKey, fieldValue, '='));
        continue;
      }

      const compareKeys = Object.keys(fieldValue);
      for (const compareKey of compareKeys) {
        const compareValue = fieldValue[compareKey];
        if (compareKey === '$eq') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '='));
        } else if (compareKey === '$like') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, 'like'));
        } else if (compareKey === '$in') {
          conditions.push(this.createInExpression(path, fieldKey, compareValue, 'in'));
        } else if (compareKey === '$nin') {
          conditions.push(this.createInExpression(path, fieldKey, compareValue, 'not in'));
        } else if (compareKey === '$ne') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '!='));
        } else if (compareKey === '$lt') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '<'));
        } else if (compareKey === '$lte') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '<='));
        } else if (compareKey === '$gt') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '>'));
        } else if (compareKey === '$gte') {
          conditions.push(this.createCompareExpression(path, fieldKey, compareValue, '>='));
        } else {
          conditions.push(this.parseFilter(fieldValue, [...path, fieldKey]));
        }
      }
    }

    if (conditions.length === 0) {
      throw new Error();
    }
    if (conditions.length === 1) {
      return conditions[0];
    }

    return {and: conditions};
  }

  where(data: RootFilter<TData>): this {
    const clone = deepClone(this);
    if (isAndRootFilter(data)) {
      if (!clone.query.where) {
        clone.query.where = {and: data.$and.map(filter => this.parseFilter(filter))};
      } else if (isSqlAndExpression(clone.query.where)) {
        clone.query.where.and.push(...data.$and.map(filter => this.parseFilter(filter)));
      } else if (isSqlOrExpression(clone.query.where)) {
        clone.query.where.or.push({and: data.$and.map(filter => this.parseFilter(filter))});
      } else {
        clone.query.where = {
          and: [clone.query.where, ...data.$and.map(filter => this.parseFilter(filter))],
        };
      }
    } else if (isOrRootFilter(data)) {
      if (!clone.query.where) {
        clone.query.where = {or: data.$or.map(filter => this.parseFilter(filter))};
      } else if (isSqlAndExpression(clone.query.where)) {
        clone.query.where.and.push({or: data.$or.map(filter => this.parseFilter(filter))});
      } else {
        clone.query.where = {
          and: [clone.query.where, {or: data.$or.map(filter => this.parseFilter(filter))}],
        };
      }
    } else {
      if (!clone.query.where) {
        clone.query.where = this.parseFilter(data);
      } else if (isSqlAndExpression(clone.query.where)) {
        clone.query.where.and.push(this.parseFilter(data));
      } else {
        clone.query.where = {
          and: [clone.query.where, this.parseFilter(data)],
        };
      }
    }

    return clone;
  }
}
