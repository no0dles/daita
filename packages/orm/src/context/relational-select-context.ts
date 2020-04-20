import {RelationalSchemaBaseContext} from './relational-schema-base-context';
import {TableInformation} from './table-information';
import {RelationalTableReferenceDescription} from '../schema/description/relational-table-reference-description';
import {RelationalSchemaDescription} from '../schema/description/relational-schema-description';
import {
  getTableFromSelector, isSqlAlias, isSqlAndExpression,
  isSqlCompareExpression, isSqlInExpression, isSqlOrExpression, isSqlSchemaTableField, RelationalExpressionBuilder,
  RelationalSelectBuilder, removeEmptySchema,
  RootFilter, SqlExpression,
  SqlRawValue
} from "@daita/relational";
import { ExcludePrimitive, Full } from "@daita/common";

export class RelationalSelectContext<T> extends RelationalSchemaBaseContext<RelationalSelectBuilder<T>, T[]> {
  private readonly shouldMapResult: boolean;

  constructor(
    schema: RelationalSchemaDescription,
    type: TableInformation<T>,
    builder: RelationalSelectBuilder<T>,
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
    this.shouldMapResult = this.isConstructor(this.type);
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

  async first(): Promise<T> {
    const result = await this.builder.first();
    return this.mapResult(result);
  }

  async firstOrDefault(): Promise<T | null> {
    const result = await this.builder.firstOrDefault();
    if (!result) {
      return null;
    }
    return this.mapResult(result);
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
    if (alias === 'base') {
      return builder;
    }

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

  toSql() {
    return this.builder.toSql();
  }

  protected async execute(): Promise<T[]> {
    const result = await super.execute();
    return result.map(item => this.mapResult(item));
  }

  private isConstructor(value: any) {
    try {
      new new Proxy(value, {
        // tslint:disable-next-line
        construct() {
          return {};
        },
      })();
      return true;
    } catch (err) {
      return false;
    }
  }

  private mapResult(result: any): T {
    const instance = this.shouldMapResult ? new (<any>this.type)() : {};
    const resultKeys = Object.keys(result);
    const baseKeys = resultKeys.filter(k => k.indexOf('.') === -1);
    const referenceKeys = resultKeys.filter(k => k.indexOf('.') > 0);
    const refGroups = referenceKeys.reduce<{ [key: string]: string[] }>((groups, key) => {
      const name = key.substr(0, key.lastIndexOf('.'));
      if (!groups[name]) {
        groups[name] = [];
      }
      groups[name].push(key);
      return groups;
    }, {});

    for (const baseKey of baseKeys) {
      (<any>instance)[baseKey] = result[baseKey];
    }
    for (const refGroupName of Object.keys(refGroups)) {
      const groupKeys = refGroups[refGroupName];
      const hasValue = groupKeys.some(key => result[key]);
      if (!hasValue) {
        continue;
      }

      const paths = refGroupName.split('.');
      let value = instance;
      for (const path of paths) {
        if (!value[path]) {
          value[path] = {};
        }
        value = value[path];
      }
      for (const groupKey of groupKeys) {
        value[groupKey.substr(refGroupName.length + 1)] = result[groupKey];
      }
    }
    return instance;
  }
}
