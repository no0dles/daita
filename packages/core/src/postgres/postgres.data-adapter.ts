import { Pool, PoolClient } from 'pg';
import {
  RelationalDataAdapter,
  RelationalSelectQuery,
  RelationalTransactionDataAdapter,
} from '../adapter';
import { RootFilter } from '../query';
import { PostgresTransactionDataAdapter } from './postgres-transaction-data-adapter';
import { PostgresSqlBuilder } from './postgres.sql-builder';
import { ensureDatabaseExists } from './postgres.util';
import { MigrationSchema } from '../schema/migration-schema';

export class PostgresDataAdapter implements RelationalDataAdapter {
  kind: 'dataAdapter' = 'dataAdapter';

  private readonly pool: Pool;
  private readonly connectionString: string | undefined;
  private initalized = false;

  sqlBuilder = new PostgresSqlBuilder();

  constructor(private poolOrUrl: string | Pool) {
    if (typeof poolOrUrl === 'string') {
      this.connectionString = poolOrUrl;
      this.pool = new Pool({
        connectionString: poolOrUrl,
      });
    } else {
      this.pool = poolOrUrl;
    }
  }

  async close() {
    await this.pool.end();
  }

  async initalize() {
    if (this.initalized) {
      return;
    }

    if (!this.connectionString) {
      return;
    }

    await ensureDatabaseExists(this.connectionString);
    this.initalized = true;
  }

  private async run<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
    let client: PoolClient | null = null;
    try {
      if (!this.initalized) {
        await this.initalize();
        this.initalized = true;
      }

      client = await this.pool.connect();
      const result = await action(client);
      if (client) {
        client.release();
        client = null;
      }
      return result;
    } catch (e) {
      if (client) {
        client.release(e);
        client = null;
      }
      throw e;
    }
  }

  delete(
    schema: MigrationSchema,
    table: string,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.delete(schema, table, filter);
    });
  }

  insert(schema: MigrationSchema, table: string, data: any[]): Promise<void> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.insert(schema, table, data);
    });
  }

  select(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<any[]> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.select(schema, table, query);
    });
  }

  update(
    schema: MigrationSchema,
    table: string,
    data: any,
    filter: RootFilter<any> | null,
  ): Promise<{ affectedRows: number }> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.update(schema, table, data, filter);
    });
  }

  async transaction(
    action: (adapter: RelationalTransactionDataAdapter) => Promise<any>,
  ) {
    await this.run(async client => {
      try {
        await client.query('BEGIN');
        const adapter = new PostgresTransactionDataAdapter(client);
        await action(adapter);
        await client.query('COMMIT');
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    });
  }

  raw(sql: string, values: any[]): Promise<{ rowCount: number; rows: any[] }> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.raw(sql, values);
    });
  }

  count(
    schema: MigrationSchema,
    table: string,
    query: RelationalSelectQuery,
  ): Promise<number> {
    return this.run(async client => {
      const adapter = new PostgresTransactionDataAdapter(client);
      return adapter.count(schema, table, query);
    });
  }
}
