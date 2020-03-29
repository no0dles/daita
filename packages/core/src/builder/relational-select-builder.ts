import {RelationalDataAdapter} from '../adapter';
import {TableInformation} from '../context/table-information';
import {Full} from '../context/types/full';
import {SqlRawValue} from '../sql/sql-raw-value';
import {deepClone, getFieldFromSelector, getSqlTable} from './utils';
import {RelationalWhereBuilder} from './relational-where-builder';
import {RelationalSelectFirstBuilder} from './relational-select-first-builder';
import {
  RelationalEmptyExpressionBuilder,
} from './relational-empty-expression-builder';
import {RelationalExpressionBuilder} from './relational-expression-builder';
import {RelationalSelectFirstOrDefaultBuilder} from './relational-select-first-or-default-builder';
import {ExcludePrimitive} from '../context/types/exclude-primitive';
import {ExcludeNonPrimitive} from '../context/types/exclude-non-primitive';
import {RelationalEmptyExpressionBuilderImpl} from './relational-empty-expression-builder-impl';
import {isSqlSchemaTable} from '../sql/sql-schema-table';
import {SqlOrderDirection, SqlSelect, SqlSelectFrom, SqlSelectJoinType, SqlSelectOrderBy} from '../sql/select';
import {isSqlAlias} from '../sql/select/sql-alias';

export class RelationalSelectBuilder<T> extends RelationalWhereBuilder<T, SqlSelect, T[]> {
  constructor(dataAdapter: RelationalDataAdapter, table?: SqlSelectFrom | null) {
    super(dataAdapter, {select: [], from: table});
  }

  field(selector: (table: ExcludeNonPrimitive<T>) => any) {
    const clone = deepClone(this);
    //TODO
    return clone;
  }

  fields(): RelationalSelectBuilder<T>
  fields(selector: (table: ExcludePrimitive<T>) => any): RelationalSelectBuilder<T>
  fields(selector?: (table: ExcludePrimitive<T>) => any): RelationalSelectBuilder<T> {
    const clone = deepClone(this);
    //TODO
    return clone;
  }

  skip(value: number) {
    const clone = deepClone(this);
    clone.query.offset = value;
    return clone;
  }

  limit(value: number) {
    const clone = deepClone(this);
    clone.query.limit = value;
    return clone;
  }

  leftJoin(table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    return this.joinTable('left', table, alias, on);
  }

  fullJoin(table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    return this.joinTable('full', table, alias, on);
  }

  crossJoin(table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    return this.joinTable('cross', table, alias, on);
  }

  rightJoin(table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    return this.joinTable('right', table, alias, on);
  }

  join(table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    return this.joinTable('inner', table, alias, on);
  }

  orderBy(
    selector: (table: Full<T>) => SqlRawValue,
    direction?: SqlOrderDirection,
  ) {
    const clone = deepClone(this);
    const field = getFieldFromSelector(selector);
    const orderBy: SqlSelectOrderBy = {field: field.field};
    if (direction) {
      orderBy.direction = direction;
    }
    if (field.table) {
      orderBy.table = field.table;
    }

    if (!clone.query.orderBy) {
      clone.query.orderBy = [orderBy];
    } else {
      clone.query.orderBy.push(orderBy);
    }

    return clone;
  }

  first(): RelationalSelectFirstBuilder<T> {
    return new RelationalSelectFirstBuilder<T>(this.dataAdapter, this.query);
  }

  firstOrDefault(): RelationalSelectFirstOrDefaultBuilder<T> {
    return new RelationalSelectFirstOrDefaultBuilder<T>(this.dataAdapter, this.limit(1).query);
  }

  count(): RelationalSelectFirstBuilder<{ count: number }> {
    return new RelationalSelectFirstBuilder<{ count: number }>(this.dataAdapter, {
      select: [{count: {all: true}, alias: 'count'}],
      from: deepClone(this.query),
    });
  }

  toSql(): SqlSelect {
    if (this.query.select.length > 0) {
      return super.toSql();
    } else {
      const query = deepClone(this.query);
      if (query.from) {
        this.addAllField(query, query.from);
      }
      if (query.joins) {
        for (const join of query.joins) {
          this.addAllField(query, join.from);
        }
      }
      return query;
    }
  }

  private addAllField(query: SqlSelect, from: SqlSelectFrom) {
    if (typeof from === 'string') {
      query.select.push({table: from, all: true});
    } else if (isSqlAlias(from)) {
      query.select.push({table: from.alias, all: true});
    } else if (isSqlSchemaTable(from)) {
      if (from.schema) {
        query.select.push({table: from.table, schema: from.schema, all: true});
      } else {
        query.select.push({table: from.table, all: true});
      }
    }
  }

  private joinTable(type: SqlSelectJoinType, table: TableInformation<any>, alias: string, on: (builder: RelationalEmptyExpressionBuilder<T>) => RelationalExpressionBuilder<T>) {
    const clone = deepClone(this);
    const expressionBuilder = on(new RelationalEmptyExpressionBuilderImpl<T>(clone.query.from));

    if (!clone.query.joins) {
      clone.query.joins = [];
    }

    clone.query.joins.push({
      type,
      from: {...getSqlTable(table), alias},
      on: expressionBuilder.expression,
    });
    return clone;
  }

  protected async execute(): Promise<T[]> {
    const result = await this.dataAdapter.raw(this.toSql());
    //TODO map
    return [];
  }
}

export function select<T>(dataAdapter: RelationalDataAdapter, table: TableInformation<T>): RelationalSelectBuilder<T> {
  if (typeof table === 'string') {
    return new RelationalSelectBuilder<T>(dataAdapter, table);
  } else if (isSqlSchemaTable(table)) {
    return new RelationalSelectBuilder<T>(dataAdapter, table);
  } else {
    return new RelationalSelectBuilder<T>(dataAdapter, table.name);
  }
}