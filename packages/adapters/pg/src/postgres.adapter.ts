import {Pool, PoolClient, types} from 'pg';
import {ensureDatabaseExists} from './postgres.util';
import {RelationalDataAdapter, SqlQuery} from '@daita/core';
import {RelationalMigrationAdapter} from '@daita/core/dist/adapter/relational-migration-adapter';
import {PostgresDataAdapter} from './postgres-data-adapter';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';
import {SqlDmlQuery} from '@daita/core/dist/sql/sql-dml-builder';

export class PostgresAdapter implements RelationalMigrationAdapter {

  private readonly pool: Pool;
  private readonly connectionString: string | undefined;
  private initalized = false;

  constructor(private poolOrUrl: string | Pool) {
    types.setTypeParser(1700, val => parseFloat(val));
    types.setTypeParser(20, val => parseInt(val));

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

  async transaction<T>(
    action: (adapter: RelationalDataAdapter) => Promise<T>,
  ): Promise<T> {
    return await this.run(async client => {
      try {
        await client.query('BEGIN');
        const adapter = new PostgresDataAdapter(client);
        const result = await action(adapter);
        await client.query('COMMIT');
        return result;
      } catch (e) {
        await client.query('ROLLBACK');
        throw e;
      }
    });
  }

  raw(sql: string, values: any[]): Promise<RelationalRawResult>;
  raw(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult>;
  raw(sql: string | SqlQuery | SqlDmlQuery, values?: any[]): Promise<RelationalRawResult> {
    return this.run(async client => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.raw(sql as any, values || []);
    });
  }
}
