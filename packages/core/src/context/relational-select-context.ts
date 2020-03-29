import {RootFilter} from '../query/root-filter';
import {MigrationSchema} from '../schema/migration-schema';
import {ExcludePrimitive} from './types/exclude-primitive';
import {Full} from './types/full';
import {DefaultConstructable} from '../constructable';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {SqlRawValue} from '../sql/sql-raw-value';
import {isSqlSchemaTableField} from '../sql/sql-schema-table-field';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';
import {getTableFromSelector} from '../builder/utils';
import {isSqlCompareExpression} from '../sql/expression/sql-compare-expression';
import {SqlSelect} from '../sql/select';
import {isSqlOrExpression} from '../sql/expression/sql-or-expression';
import {SqlExpression} from '../sql/expression';
import {isSqlAndExpression} from '../sql/expression/sql-and-expression';
import {isSqlInExpression} from '../sql/expression/sql-in-expression';
import {isSqlAlias} from '../sql/select/sql-alias';

export class RelationalSelectContext<T> extends RelationalSchemaBaseContext<T[]> {
  //protected shouldMapResult: boolean;

  constructor(
    private schema: MigrationSchema,
    private type: DefaultConstructable<T>,
    private builder: RelationalSelectBuilder<T>,
  ) {
    super(builder);
    //this.shouldMapResult = this.isConstructor(this.type);
  }

  skip(value: number) {
    const newBuilder = this.builder.skip(value);
    return new RelationalSelectContext<T>(this.schema, this.type, newBuilder);
  }

  limit(value: number) {
    const newBuilder = this.builder.limit(value);
    return new RelationalSelectContext<T>(this.schema, this.type, newBuilder);
  }

  where(filter: RootFilter<T>) {
    let newBuilder = this.builder.where(filter);
    const query = this.getBuilderQuery(newBuilder);
    if (query.where) {
      newBuilder = this.ensureExpressionJoin(newBuilder, query.where);
    }
    return new RelationalSelectContext<T>(this.schema, this.type, newBuilder);
  }

  async first(): Promise<T | null> {
    return this.builder.first();
  }

  async count(): Promise<number> {
    const newBuilder = this.builder.count();
    const result = await newBuilder;
    return result.count;
  }

  include(selector: (table: ExcludePrimitive<T>) => any) {
    const tableAlias = getTableFromSelector(selector);
    if (!tableAlias) {
      throw new Error('invalid include');
    }
    const newBuilder = this.ensureJoin(this.builder, tableAlias);
    return new RelationalSelectContext<T>(this.schema, this.type, newBuilder);
  }

  orderBy(
    selector: (table: Full<T>) => SqlRawValue,
    direction?: 'asc' | 'desc',
  ) {
    let newBuilder = this.builder.orderBy(selector, direction);
    const query = this.getBuilderQuery(newBuilder);
    if (query.orderBy) {
      for (const orderBy of query.orderBy) {
        if (isSqlSchemaTableField(orderBy) && orderBy.table) {
          newBuilder = this.ensureJoin(newBuilder, orderBy.table);
        }
      }
    }
    return new RelationalSelectContext<T>(this.schema, this.type, newBuilder);
  }

  private hasJoin(builder: RelationalSelectBuilder<T>, alias: string) {
    const query = this.getBuilderQuery(builder);
    if (!query.joins) {
      return false;
    } else {
      for (const join of query.joins) {
        if (isSqlAlias(join.from) && join.from.alias === alias) {
          return true;
        }
      }
      return false;
    }
  }

  private ensureJoin(builder: RelationalSelectBuilder<T>, alias: string): RelationalSelectBuilder<T> {
    if (this.hasJoin(builder, alias)) {
      return builder;
    }

    const aliasParts = alias.split('.');
    //const newBuilder = builder.join(, ,);
    return builder;
  }

  private ensureExpressionJoin(builder: RelationalSelectBuilder<T>, expression: SqlExpression): RelationalSelectBuilder<T> {
    if (isSqlAndExpression(expression)) {
      for (const andExpression of expression.and) {
        builder = this.ensureExpressionJoin(builder, andExpression);
      }
    } else if (isSqlOrExpression(expression)) {
      for (const orExpression of expression.or) {
        builder = this.ensureExpressionJoin(builder, orExpression);
      }
    } else if (isSqlCompareExpression(expression)) {
      if (isSqlSchemaTableField(expression.left) && expression.left.table) {
        builder = this.ensureJoin(builder, expression.left.table);
      }
      if (isSqlSchemaTableField(expression.right) && expression.right.table) {
        builder = this.ensureJoin(builder, expression.right.table);
      }
    } else if (isSqlInExpression(expression)) {
      if (isSqlSchemaTableField(expression.left) && expression.left.table) {
        builder = this.ensureJoin(builder, expression.left.table);
      }
    }
    return builder;
  }

  private getBuilderQuery(builder: RelationalSelectBuilder<T>): SqlSelect {
    return (<any>builder).query;
  }

  // private isConstructor(value: any) {
  //   try {
  //     new new Proxy(value, {
  //       // tslint:disable-next-line
  //       construct() {
  //         return {};
  //       },
  //     })();
  //     return true;
  //   } catch (err) {
  //     return false;
  //   }
  // }

  // private mapResult(result: any): T {
  //   const instance = new (<any>this.type)();
  //   for (const key of Object.keys(result)) {
  //     (<any>instance)[key] = result[key];
  //   }
  //   return instance;
  // }
}