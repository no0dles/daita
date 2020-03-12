import {SqlDelete} from '../sql/sql-delete';
import {SqlQuery} from '../sql/sql-query';
import {SqlUpdate} from '../sql/sql-update';
import {SqlSelect} from '../sql/sql-select';
import {SqlInsert} from '../sql/sql-insert';
import {SqlExpression} from '../sql/sql-expression';
import {SqlCompareExpression} from '../sql/sql-compare-expression';
import {SqlSchemaTable} from '../sql/sql-schema-table';
import {SqlAlias} from '../sql/sql-alias';
import {AndRootFilter, OrRootFilter, QueryFilter, RootFilter} from '../query';
import {RelationalRawResult} from './relational-raw-result';
import {Condition} from '../schema';
import {SqlOperand} from '../sql/sql-operand';
import {SqlInOperand} from '../sql/sql-in-operand';
import {SqlInExpression} from '../sql/sql-in-expression';
import {MigrationSchema} from '../schema/migration-schema';
import {MigrationSchemaTable} from '../schema/migration-schema-table';
import {RelationalSelectQuery} from './relational-select-query';
import {RelationalDataAdapter} from './relational-data-adapter';
import {SqlAndExpression} from '../sql/sql-and-expression';

export abstract class RelationalBaseAdapter implements RelationalDataAdapter {

  protected abstract runQuery(sql: SqlQuery | string, values?: any[]): Promise<RelationalRawResult>;

  abstract isKind(kind: 'data' | 'migration' | 'transaction'): boolean;

  protected buildMapper(key: string) {
    const [alias, fieldName] = key.split('.');
    if (alias === 'base') {
      return {set: (row: any, val: any) => (row[fieldName] = val)};
    } else {
      const aliasPath = alias.substr('base_'.length).split('_');
      return {
        set: (row: any, val: any) => {
          let current = row;
          if (val !== null && val !== undefined) {
            for (const path of aliasPath) {
              if (!current[path]) {
                current[path] = {};
              }
              current = current[path];
            }
            current[fieldName] = val;
          }
        },
      };
    }
  }

  protected mapResults(rows: any[]) {
    const mappedRows: any[] = [];
    const fieldMapping: {
      [key: string]: { set: (row: any, val: any) => void };
    } = {};
    for (const row of rows) {
      const mappedRow: any = {};
      for (const key of Object.keys(row)) {
        if (!fieldMapping[key]) {
          fieldMapping[key] = this.buildMapper(key);
        }
        fieldMapping[key].set(mappedRow, row[key]);
      }
      mappedRows.push(mappedRow);
    }

    return mappedRows;
  }

  private mapSourceTable(table: MigrationSchemaTable) {
    return `${table.name}_${table.sourceMigration.id}`;
  }

  private getSourceField(table: MigrationSchemaTable, fieldName: string) {
    const field = table.field(fieldName);
    if (!field) {
      throw new Error(
        `Could not find field ${fieldName} in table ${table.name}`,
      );
    }
    return field.baseFieldName;
  }

  private getSchemaTable(schema: MigrationSchema, tableName: string) {
    const table = schema.table(tableName);
    if (!table) {
      throw new Error(`Could not find table ${tableName}`);
    }
    return table;
  }

  async delete(
    schema: MigrationSchema,
    tableName: string,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }> {
    const table = this.getSchemaTable(schema, tableName);
    const sql: SqlDelete = {
      delete: this.mapSourceTable(table),
    };
    if (filter) {
      sql.where = this.parseInlineFilter(schema, table, filter);
    }

    const result = await this.runQuery(sql);
    return {affectedRows: result.rowCount};
  }

  async insert(
    schema: MigrationSchema,
    tableName: string,
    rows: any[],
  ): Promise<void> {
    const table = this.getSchemaTable(schema, tableName);
    const fields: string[] = [];
    const values: any[][] = [];

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (fields.indexOf(key) === -1) {
          fields.push(key);
        }
      }
    }

    for (const row of rows) {
      const rowValues: any[] = [];
      for (const field of fields) {
        if (row[field] === null || row[field] === undefined) {
          rowValues.push(null);
        } else {
          rowValues.push(row[field]);
        }
      }
      values.push(rowValues);
    }

    const sql: SqlInsert = {
      insert: this.mapSourceTable(table),
      into: fields.map(field => this.getSourceField(table, field)),
      values,
    };

    await this.runQuery(sql);
  }

  async count(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<number> {
    const table = this.getSchemaTable(schema, tableName);

    const select: SqlSelect = {
      select: [],
      from: {table: this.mapSourceTable(table), alias: 'base'},
    };

    if (query.filter) {
      select.where = this.parseJoinFilter(schema, table, query.filter, select);
    }

    const sql: SqlSelect = {
      select: [{count: {all: true}, alias: 'count'}],
      from: { ...select, alias: 'cnt' },
    };

    const result = await this.runQuery(sql);
    return parseInt(result.rows[0].count, 0);
  }

  private addTableFields(select: SqlSelect, table: MigrationSchemaTable, tableAlias: string) {
    for (const field of table.fields) {
      select.select.push({
        table: tableAlias,
        field: field.baseFieldName,
        alias: `${tableAlias}.${field.name}`,
      });
    }
  }

  private addInclude(select: SqlSelect, schema: MigrationSchema, table: MigrationSchemaTable, tableAlias: string, includePath: string[], addFields: boolean) {
    if (!select.joins) {
      select.joins = [];
    }

    for (const pathPart of includePath) {
      const newAlias = `${tableAlias}_${pathPart}`;
      const foreignKey = table.foreignKeys.filter(
        fk => fk.name === pathPart,
      )[0];
      if (!foreignKey) {
        throw new Error(
          `could not find foreign table for ${pathPart} of ${table.name}`,
        );
      }

      const foreignTable = schema.table(foreignKey.table);
      if (!foreignTable) {
        continue;
      }

      if (!select.joins.some(join => (<SqlSchemaTable & SqlAlias>join.from).alias === newAlias)) {
        const joinExpressions: SqlCompareExpression[] = [];
        for (let i = 0; i < foreignTable.primaryKeys.length; i++) {
          const foreignField = foreignTable.field(foreignKey.foreignKeys[i]);
          const field = table.field(foreignKey.keys[i]);
          joinExpressions.push({
            left: {table: tableAlias, field: field.baseFieldName},
            operand: '=',
            right: {table: newAlias, field: foreignField.baseFieldName},
          });
        }

        select.joins.push({
          type: 'left',
          from: {table: this.mapSourceTable(foreignTable), alias: newAlias},
          on: this.reduceExpressions({
            and: joinExpressions,
          }),
        });
      }

      if (addFields) {
        this.addTableFields(select, foreignTable, newAlias);
      }

      table = foreignTable;
      tableAlias = newAlias;
    }

    return tableAlias;
  }

  async select(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<any[]> {
    const table = this.getSchemaTable(schema, tableName);

    const sql: SqlSelect = {
      select: [],
      from: {table: this.mapSourceTable(table), alias: 'base'},
    };

    if (query.limit) {
      sql.limit = query.limit;
    }
    if (query.skip) {
      sql.offset = query.skip;
    }

    this.addTableFields(sql, table, 'base');
    for (const include of query.include) {
      this.addInclude(sql, schema, table, 'base', include.path, true);
    }


    if (query.filter) {
      sql.where = this.parseJoinFilter(schema, table, query.filter, sql);
    }

    if (query.orderBy.length > 0) {
      if (!sql.orderBy) {
        sql.orderBy = [];
      }
      for (const orderBy of query.orderBy) {
        if (orderBy.path.length === 1) {
          sql.orderBy.push({
            field: this.getSourceField(table, orderBy.path[0]),
            table: 'base',
            direction: orderBy.direction,
          });
        } else {
          const path = [...orderBy.path];
          const field = path.splice(orderBy.path.length - 1, 1)[0];
          const tableAlias = this.addInclude(sql, schema, table, 'base', path, false);
          sql.orderBy.push({field: this.getSourceField(table, field), table: tableAlias, direction: orderBy.direction});
        }
      }
    }

    const result = await this.runQuery(sql);
    return this.mapResults(result.rows);
  }

  async update(
    schema: MigrationSchema,
    tableName: string,
    data: any,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }> {
    const table = this.getSchemaTable(schema, tableName);
    const update: { [key: string]: any } = {};
    for (const key of Object.keys(data)) {
      update[this.getSourceField(table, key)] = data[key];
    }

    const sql: SqlUpdate = {
      update: this.mapSourceTable(table),
      set: update,
    };
    if (filter) {
      sql.where = this.parseInlineFilter(schema, table, filter);
    }
    const result = await this.runQuery(sql);
    return {affectedRows: result.rowCount};
  }

  async raw(
    sql: SqlQuery | string,
    values?: any[],
  ): Promise<{ rowCount: number; rows: any[] }> {
    const result = await this.runQuery(sql, values);
    return {
      rowCount: result.rowCount,
      rows: result.rows,
    };
  }

  private parseInlineFilter(schema: MigrationSchema, table: MigrationSchemaTable, filter: any): SqlExpression {
    return this.parseFilter(schema, table, filter, [], (tbl, prop, path, operand, value) => {
      if (tbl !== table) {
        throw new Error('not supported yet');
      }

      if (operand === 'in' || operand === 'not in') {
        return {
          left: {field: this.getSourceField(table, prop)},
          operand,
          value,
        } as SqlInExpression;
      }
      return {
        left: {field: this.getSourceField(table, prop)},
        operand,
        right: value,
      } as SqlCompareExpression;
    });
  }

  private parseJoinFilter(schema: MigrationSchema, table: MigrationSchemaTable, filter: any, select: SqlSelect): SqlExpression {
    return this.parseFilter(schema, table, filter, ['base'], (tbl, prop, path, operand, value) => {
      const tableAlias = path.join('_');
      const includePath = [...path];
      includePath.splice(0, 1);
      this.addInclude(select, schema, table, 'base', includePath, false);

      if (operand === 'in' || operand === 'not in') {
        return {
          left: {table: tableAlias, field: this.getSourceField(tbl, prop)},
          operand,
          value,
        } as SqlInExpression;
      }
      return {
        left: {table: tableAlias, field: this.getSourceField(tbl, prop)},
        operand,
        right: value,
      } as SqlCompareExpression;
    });
  }

  private reduceExpressions(sql: SqlAndExpression): SqlExpression {
    if (sql.and && sql.and.length === 1) {
      return sql.and[0];
    }
    return sql;
  }

  private parseFilter(schema: MigrationSchema, table: MigrationSchemaTable,
                      filter: OrRootFilter<any> | AndRootFilter<any> | QueryFilter<any> | RootFilter<any> | Condition<any>,
                      path: string[], map: (tbl: MigrationSchemaTable, prop: string, path: string[], operand: SqlOperand | SqlInOperand, value: any) => SqlExpression): SqlExpression {
    if ((<AndRootFilter<any>>filter).$and) {
      return this.reduceExpressions({
        and: (<AndRootFilter<any>>filter).$and.map(condition => this.parseFilter(schema, table, condition, path, map)),
      });
    } else if ((<OrRootFilter<any>>filter).$or) {
      return {
        or: (<OrRootFilter<any>>filter).$or.map(condition => this.parseFilter(schema, table, condition, path, map)),
      };
    } else {
      const conditions: SqlExpression[] = [];
      for (const filterKey of Object.keys(filter)) {
        const value = (<any>filter)[filterKey];
        if (
          value instanceof Date ||
          typeof value === 'number' ||
          typeof value === 'string' ||
          typeof value === 'boolean'
        ) {
          return map(table, filterKey, path, '=', value);
        } else if (typeof value === 'object') {
          for (const key of Object.keys(value)) {
            const objectValue = value[key];
            if (key === '$eq') {
              conditions.push(map(table, filterKey, path, '=', objectValue));
            } else if (key === '$like') {
              conditions.push(map(table, filterKey, path, 'like', objectValue));
            } else if (key === '$in') {
              conditions.push(map(table, filterKey, path, 'in', objectValue));
            } else if (key === '$nin') {
              conditions.push(map(table, filterKey, path, 'not in', objectValue));
            } else if (key === '$ne') {
              conditions.push(map(table, filterKey, path, '!=', objectValue));
            } else if (key === '$lt') {
              conditions.push(map(table, filterKey, path, '<', objectValue));
            } else if (key === '$lte') {
              conditions.push(map(table, filterKey, path, '<=', objectValue));
            } else if (key === '$gt') {
              conditions.push(map(table, filterKey, path, '>', objectValue));
            } else if (key === '$gte') {
              conditions.push(map(table, filterKey, path, '>=', objectValue));
            } else {
              const foreignKey = table.foreignKeys.filter(fk => fk.name === filterKey)[0];
              if (!foreignKey) {
                throw new Error(`unknown filter ${key}`);
              }
              const foreignTable = this.getSchemaTable(schema, foreignKey.table);
              conditions.push(this.parseFilter(schema, foreignTable, value, [...path, filterKey], map));
            }
          }
        }
      }
      return this.reduceExpressions({and: conditions});
    }
  }
}