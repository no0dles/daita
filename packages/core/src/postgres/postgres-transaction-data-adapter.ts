import { PoolClient } from 'pg';
import {
  RelationalSelectQuery,
  RelationalTransactionDataAdapter,
} from '../adapter';
import { RootFilter } from '../query';
import { MigrationSchema } from '../schema/migration-schema';
import { MigrationSchemaTable } from '../schema/migration-schema-table';
import { RelationalTableSchemaTableReferenceKey } from '../schema/relational-table-schema-table-reference-key';
import * as debug from 'debug';

export interface SelectSql {
  select: { tableAlias: string; field: string; alias: string }[];
  from: { table: string; alias: string };
  where: { tableAlias: string; field: string; operator: string }[];
  orderBy: { tableAlias: string; field: string; direction: string }[];
}

export class PostgresTransactionDataAdapter
  implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private client: PoolClient) {}

  private buildMapper(key: string) {
    const [alias, fieldName] = key.split('.');
    if (alias === 'base') {
      return { set: (row: any, val: any) => (row[fieldName] = val) };
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

  private mapResults(rows: any[]) {
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
    return `${table.sourceMigration.id}_${table.name}`;
  }

  private getSourceField(table: MigrationSchemaTable, fieldName: string) {
    const field = table.field(fieldName);
    if (!field) {
      throw new Error(
        `Could not find field ${fieldName} in table ${table.name}`,
      );
    }
    return `${field.sourceMigration.id}_${field.sourceFieldName}`;
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
    const values: any[] = [];
    const conditions = this.parseFilter(table, filter, values);
    const sql = `DELETE FROM "${this.mapSourceTable(table)}" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    const result = await this.runQuery(sql, values);
    return { affectedRows: result.rowCount };
  }

  async insert(
    schema: MigrationSchema,
    tableName: string,
    rows: any[],
  ): Promise<void> {
    const table = this.getSchemaTable(schema, tableName);
    const fields: string[] = [];
    const values: any[] = [];
    const rowPlaceholders: string[] = [];

    for (const row of rows) {
      for (const key of Object.keys(row)) {
        if (fields.indexOf(key) === -1) {
          fields.push(key);
        }
      }
    }

    for (const row of rows) {
      const placeholders = [];
      for (const field of fields) {
        if (row[field] === null || row[field] === undefined) {
          values.push(null);
        } else {
          values.push(row[field]);
        }
        placeholders.push(`$${values.length}`);
      }
      rowPlaceholders.push(`(${placeholders.join(', ')})`);
    }

    const sql = `INSERT INTO "${this.mapSourceTable(table)}" (${fields
      .map(field => `"${this.getSourceField(table, field)}"`)
      .join(', ')}) VALUES ${rowPlaceholders.join(', ')}`;

    await this.runQuery(sql, values);
  }

  private async runQuery(sql: string, values: any[]) {
    debug('daita:core:postgres')(sql);
    return await this.mapError(this.client.query(sql, values));
  }

  private async mapError<T>(run: Promise<T>): Promise<T> {
    try {
      const result = await run;
      return result;
    } catch (e) {
      if (e.code === '23505') {
        throw new Error('primary key already exists');
      }
      debug('daita:core:postgres')(e.message);
      throw e;
    }
  }

  async count(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<number> {
    const table = this.getSchemaTable(schema, tableName);
    const values: any[] = [];
    const conditions = this.parseFilter(table, query.filter, values);

    const sql = `SELECT count(*) count FROM "${this.mapSourceTable(table)}" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    const result = await this.runQuery(sql, values);
    return parseInt(result.rows[0].count, 0);
  }

  private addInclude(
    baseTable: MigrationSchemaTable,
    baseAlias: string,
    joinTable: MigrationSchemaTable,
    joinAlias: string,
    foreignKey: RelationalTableSchemaTableReferenceKey,
  ) {
    const sql = ` LEFT JOIN "${this.mapSourceTable(
      joinTable,
    )}" "${joinAlias}" ON `;

    return (
      sql +
      Array.from(Array(foreignKey.keys.length).keys())
        .map(index => {
          const foreignField = joinTable.field(foreignKey.foreignKeys[index]);
          const field = baseTable.field(foreignKey.keys[index]);
          return `"${joinAlias}"."${foreignField.baseFieldName}" = "${baseAlias}"."${field.baseFieldName}"`;
        })
        .join(' AND ')
    );
  }

  async select(
    schema: MigrationSchema,
    tableName: string,
    query: RelationalSelectQuery,
  ): Promise<any[]> {
    const table = this.getSchemaTable(schema, tableName);
    const fields: string[] = [];
    const values: any[] = [];
    const conditions = this.parseFilter(table, query.filter, values);

    const includedTables: { table: MigrationSchemaTable; alias: string }[] = [
      { table, alias: 'base' },
    ];

    let sql = `FROM "${this.mapSourceTable(table)}" "base" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    for (const include of query.include) {
      let baseAlias = 'base';
      let baseTable = table;

      for (const pathPart of include.path) {
        const foreignKey = baseTable.foreignKeys.filter(
          fk => fk.name === pathPart,
        )[0];
        if (!foreignKey) {
          throw new Error(
            `could not find foreign table for ${pathPart} of ${baseTable.name}`,
          );
        }

        const foreignTable = schema.table(foreignKey.table);
        if (!foreignTable) {
          continue;
        }

        sql += this.addInclude(
          baseTable,
          baseAlias,
          foreignTable,
          `${baseAlias}_${pathPart}`,
          foreignKey,
        );
        baseAlias = `${baseAlias}_${pathPart}`;
        baseTable = foreignTable;
        includedTables.push({ table: foreignTable, alias: baseAlias });
      }
    }

    for (const includedTable of includedTables) {
      fields.push(
        ...includedTable.table.fieldNames.map(
          field =>
            `"${includedTable.alias}"."${this.getSourceField(
              includedTable.table,
              field,
            )}" "${includedTable.alias}.${field}"`,
        ),
      );
    }
    sql = `SELECT ${fields.join(', ')} ` + sql;

    if (query.orderBy.length > 0) {
      sql =
        sql +
        ` ORDER BY ${query.orderBy
          .map(
            orderBy =>
              `${this.getSourceField(table, orderBy.path[0])} ${
                orderBy.direction
              }`,
          ) //todo
          .join(', ')}`;
    }

    if (query.skip) {
      sql = sql + ` OFFSET ${query.skip}`;
    }
    if (query.limit) {
      sql = sql + ` LIMIT ${query.limit}`;
    }


    const result = await this.runQuery(sql, values);
    return this.mapResults(result.rows);
  }

  async update(
    schema: MigrationSchema,
    tableName: string,
    data: any,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }> {
    const table = this.getSchemaTable(schema, tableName);
    const fields: string[] = [];
    const values = [];
    for (const key of Object.keys(data)) {
      values.push(data[key]);
      fields.push(`"${this.getSourceField(table, key)}" = $${values.length}`);
    }
    const conditions = this.parseFilter(table, filter, values);
    const sql = `UPDATE "${this.mapSourceTable(table)}" SET ${fields.join(
      ', ',
    )} ${conditions.length > 0 ? 'WHERE ' + conditions : ''}`;

    const result = await this.runQuery(sql, values);
    return { affectedRows: result.rowCount };
  }

  async raw(
    sql: string,
    values: any[],
  ): Promise<{ rowCount: number; rows: any[] }> {
    const result = await this.runQuery(sql, values);
    return {
      rowCount: result.rowCount,
      rows: result.rows,
    };
  }

  private parseFilter(table: MigrationSchemaTable, filter: any, values: any[]) {
    if (filter === null) {
      return '';
    }

    if (filter.$and) {
      return `(${filter.$and
        .map((and: any) => this.parseFilter(table, and, values))
        .join(' AND ')})`;
    } else if (filter.$or) {
      return `(${filter.$or
        .map((or: any) => this.parseFilter(table, or, values))
        .join(' OR ')})`;
    } else {
      const conditions: string[] = [];
      for (const key of Object.keys(filter)) {
        const value = filter[key];
        if (
          value instanceof Date ||
          typeof value === 'number' ||
          typeof value === 'string' ||
          typeof value === 'boolean'
        ) {
          values.push(value);
          conditions.push(
            `"${this.getSourceField(table, key)}" = $${values.length}`,
          );
        } else if (typeof value === 'object') {
          if (value.$eq) {
            values.push(value.$eq);
            conditions.push(
              `"${this.getSourceField(table, key)}" = $${values.length}`,
            );
          } else if (value.$like) {
            values.push(value.$like);
            conditions.push(
              `"${this.getSourceField(table, key)}" like $${values.length}`,
            );
          } else if (value.$in) {
            const params = [];
            for (const inValue of value.$in) {
              values.push(inValue);
              params.push(`$${values.length}`);
            }

            conditions.push(
              `"${this.getSourceField(table, key)}" in (${params.join(', ')})`,
            );
          } else if (value.$nin) {
            const params = [];
            for (const inValue of value.$nin) {
              values.push(inValue);
              params.push(`$${values.length}`);
            }

            conditions.push(
              `"${this.getSourceField(table, key)}" not in (${params.join(
                ', ',
              )})`,
            );
          } else if (value.$ne) {
            values.push(value.$ne);
            conditions.push(
              `"${this.getSourceField(table, key)}" != $${values.length}`,
            );
          } else if (value.$lt) {
            values.push(value.$lt);
            conditions.push(
              `"${this.getSourceField(table, key)}" < $${values.length}`,
            );
          } else if (value.$lte) {
            values.push(value.$lte);
            conditions.push(
              `"${this.getSourceField(table, key)}" <= $${values.length}`,
            );
          } else if (value.$gt) {
            values.push(value.$gt);
            conditions.push(
              `"${this.getSourceField(table, key)}" > $${values.length}`,
            );
          } else if (value.$gte) {
            values.push(value.$gte);
            conditions.push(
              `"${this.getSourceField(table, key)}" >= $${values.length}`,
            );
          } else {
            throw new Error(`unknown filter ${JSON.stringify(value)}`);
          }
        }
      }
      return conditions.join(' AND ');
    }
  }
}
