import {RootFilter} from '../query/root-filter';
import {ExcludePrimitive} from './types/exclude-primitive';
import {Full} from './types/full';
import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {SqlRawValue} from '../sql/sql-raw-value';
import {isSqlSchemaTableField} from '../sql/sql-schema-table-field';
import {RelationalSelectBuilder} from '../builder/relational-select-builder';
import {getTableFromSelector} from '../builder/utils';
import {isSqlCompareExpression} from '../sql/expression/sql-compare-expression';
import {isSqlOrExpression} from '../sql/expression/sql-or-expression';
import {SqlExpression} from '../sql/expression';
import {isSqlAndExpression} from '../sql/expression/sql-and-expression';
import {isSqlInExpression} from '../sql/expression/sql-in-expression';
import {isSqlAlias} from '../sql/select/sql-alias';
import {TableInformation} from './table-information';
import {RelationalExpressionBuilder} from '../builder/relational-expression-builder';
import {RelationalTableReferenceDescription} from '../schema/description/relational-table-reference-description';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {RelationalTableDescription} from '../schema/description/relational-table-description';
import {removeEmptySchema} from '../utils/remove-empty-schema';

export class RelationalSelectContext<T> extends RelationalSchemaBaseContext<T[]> {
  //protected shouldMapResult: boolean;

  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    private builder: RelationalSelectBuilder<T>,
  ) {
    super(builder, type, schema);

    const tableDescription = this.schema.table(this.type);
    for (const fieldDescription of tableDescription.fields) {
      this.builder = this.builder.field({
        alias: fieldDescription.key,
        field: fieldDescription.name,
        table: 'base',
      });
    }
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
      this.mapExpressionFields(query.where);
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
    const newBuilder = this.ensureJoin(this.builder, tableAlias, true);
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
          this.mapTableField(orderBy);
          newBuilder = this.ensureJoin(newBuilder, orderBy.table, false);
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

  private iterateJoins(alias: string, callback: (tableAlias: string, reference: RelationalTableReferenceDescription, referenceAlias: string) => void) {
    const aliasParts = alias.split('.');
    const aliasPath: string[] = [];

    let tableDescription = this.schema.table(this.type);
    let tableAlias = 'base';
    for (const aliasPart of aliasParts) {
      aliasPath.push(aliasPart);
      const reference = tableDescription.reference(aliasPart);
      callback(tableAlias, reference, aliasPath.join('.'));
      tableDescription = reference.table;
      tableAlias = aliasPath.join('.');
    }
  }

  private ensureJoin(builder: RelationalSelectBuilder<T>, alias: string, includeFields: boolean): RelationalSelectBuilder<T> {
    if (this.hasJoin(builder, alias)) {
      if (includeFields) {
        this.iterateJoins(alias, (tableAlias, reference, referenceAlias) => {
          for (const field of reference.table.fields) {
            builder = builder.field({
              field: field.name,
              table: referenceAlias,
              alias: `${referenceAlias}.${field.key}`,
            });
          }
        });
      }
      return builder;
    }


    this.iterateJoins(alias, (tableAlias, reference, referenceAlias) => {
      builder = builder.leftJoin(removeEmptySchema({
        table: reference.table.name,
        schema: reference.table.schema,
      }), referenceAlias, on => {
        for (const key of reference.keys) {
          on = on.eq({
            table: tableAlias,
            field: key.field.name,
          }, {table: referenceAlias, field: key.foreignField.name});
        }
        return on as RelationalExpressionBuilder<T>;
      });

      if (includeFields) {
        for (const field of reference.table.fields) {
          builder = builder.field({field: field.name, table: referenceAlias, alias: `${alias}.${field.key}`});
        }
      }
    });

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
        builder = this.ensureJoin(builder, expression.left.table, false);
      }
      if (isSqlSchemaTableField(expression.right) && expression.right.table) {
        builder = this.ensureJoin(builder, expression.right.table, false);
      }
    } else if (isSqlInExpression(expression)) {
      if (isSqlSchemaTableField(expression.left) && expression.left.table) {
        builder = this.ensureJoin(builder, expression.left.table, false);
      }
    }
    return builder;
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
