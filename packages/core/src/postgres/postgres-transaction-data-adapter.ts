import {PoolClient} from 'pg';
import {RelationalSelectQuery, RelationalTransactionDataAdapter} from '../adapter';
import {RootFilter} from '../query';
import {RelationalSelectContext} from '../context';
import {MigrationSchema} from '../schema/migration-schema';
import {MigrationSchemaTable} from '../schema/migration-schema-table';

export class PostgresTransactionDataAdapter implements RelationalTransactionDataAdapter {
  kind: 'transactionDataAdapter' = 'transactionDataAdapter';

  constructor(private client: PoolClient) {
  }

  private mapResults(table: MigrationSchemaTable, rows: any[]) {
    const mappedRows: any[] = [];
    const fieldMapping: { [key: string]: string } = {};
    for (const row of rows) {
      const mappedRow: any = {};
      for (const key of Object.keys(row)) {
        if (!fieldMapping[key]) {
          const field = table.sourceField(key);
          if (!field) {
            throw new Error(`Could not find field ${key} in table ${table.name}`);
          }
          fieldMapping[key] = field.name;
        }
        mappedRow[fieldMapping[key]] = row[key];
      }
      mappedRows.push(mappedRow);
    }

    return mappedRows;
  }

  private mapSourceTable(table: MigrationSchemaTable, tableName: string) {
    return `${table.sourceMigration.id}_${tableName}`;
  }

  private getSourceField(table: MigrationSchemaTable, fieldName: string) {
    const field = table.field(fieldName);
    if (!field) {
      throw new Error(`Could not find field ${fieldName} in table ${table.name}`);
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
    console.log(conditions, filter);
    let sql = `DELETE FROM "${this.mapSourceTable(table, tableName)}" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    const result = await this.runQuery(sql, values);
    return {affectedRows: result.rowCount};
  }

  async insert(schema: MigrationSchema, tableName: string, rows: any[]): Promise<void> {
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

    let sql = `INSERT INTO "${this.mapSourceTable(table, tableName)}" (${fields
      .map(field => `"${this.getSourceField(table, field)}"`)
      .join(', ')}) VALUES ${rowPlaceholders.join(', ')}`;

    await this.runQuery(sql, values);
  }

  private async runQuery(sql: string, values: any[]) {
    console.log(sql);
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
      console.log(e);
      throw e;
    }
  }

  async count(schema: MigrationSchema, tableName: string, query: RelationalSelectQuery): Promise<number> {
    const table = this.getSchemaTable(schema, tableName);
    const values: any[] = [];
    const conditions = this.parseFilter(table, query.filter, values);

    let sql = `SELECT count(*) count FROM "${this.mapSourceTable(table, tableName)}" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    const result = await this.runQuery(sql, values);
    return parseInt(result.rows[0].count);
  }

  async select(schema: MigrationSchema,
               tableName: string,
               query: RelationalSelectQuery,
  ): Promise<Document[]> {
    const table = this.getSchemaTable(schema, tableName);
    const fields: string[] = [];
    const values: any[] = [];
    const conditions = this.parseFilter(table, query.filter, values);


    let sql = `SELECT * FROM "${this.mapSourceTable(table, tableName)}" ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`.trim();

    if (query.skip) {
      sql = sql + ` OFFSET ${query.skip}`;
    }
    if (query.limit) {
      sql = sql + ` LIMIT ${query.limit}`;
    }

    if (query.orderBy.length > 0) {
      sql = sql + `ORDER BY ${
        query.orderBy
          .map(orderBy => `${this.getSourceField(table, orderBy.path)} ${orderBy.direction}`)
          .join(', ')
      }`;
    }

    const result = await this.runQuery(sql, values);
    return this.mapResults(table, result.rows);
  }

  async update(schema: MigrationSchema,
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
    let sql = `UPDATE "${this.mapSourceTable(table, tableName)}" SET ${fields.join(', ')} ${
      conditions.length > 0 ? 'WHERE ' + conditions : ''
    }`;

    const result = await this.runQuery(sql, values);
    return {affectedRows: result.rowCount};
  }

  async raw(sql: string, values: any[]): Promise<{ rowCount: number, rows: any[] }> {
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
          conditions.push(`"${this.getSourceField(table, key)}" = $${values.length}`);
        } else if (typeof value === 'object') {
          if (value.$eq) {
            values.push(value.$eq);
            conditions.push(`"${this.getSourceField(table, key)}" = $${values.length}`);
          } else if (value.$like) {
            values.push(value.$like);
            conditions.push(`"${this.getSourceField(table, key)}" like $${values.length}`);
          } else if (value.$in) {
            const params = [];
            for (const inValue of value.$in) {
              values.push(inValue);
              params.push(`$${values.length}`);
            }

            conditions.push(`"${this.getSourceField(table, key)}" in (${params.join(', ')})`);
          } else if (value.$nin) {
            const params = [];
            for (const inValue of value.$nin) {
              values.push(inValue);
              params.push(`$${values.length}`);
            }

            conditions.push(`"${this.getSourceField(table, key)}" not in (${params.join(', ')})`);
          } else if (value.$ne) {
            values.push(value.$ne);
            conditions.push(`"${this.getSourceField(table, key)}" != $${values.length}`);
          } else if (value.$lt) {
            values.push(value.$lt);
            conditions.push(`"${this.getSourceField(table, key)}" < $${values.length}`);
          } else if (value.$lte) {
            values.push(value.$lte);
            conditions.push(`"${this.getSourceField(table, key)}" <= $${values.length}`);
          } else if (value.$gt) {
            values.push(value.$gt);
            conditions.push(`"${this.getSourceField(table, key)}" > $${values.length}`);
          } else if (value.$gte) {
            values.push(value.$gte);
            conditions.push(`"${this.getSourceField(table, key)}" >= $${values.length}`);
          } else {
            throw new Error(`unknown filter ${JSON.stringify(value)}`);
          }
        }
      }
      return conditions.join(' AND ');
    }
  }
}
