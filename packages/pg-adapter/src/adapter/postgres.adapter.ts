import {Pool, PoolClient, types} from 'pg';
import {PostgresDataAdapter} from './postgres-data-adapter';
import {
  RelationalDataAdapter,
  RelationalTransactionAdapter,
  RelationalRawResult,
} from "@daita/relational";
import { postgresFormatter } from './postgres-formatter';

export class PostgresAdapter implements RelationalTransactionAdapter {
  private readonly pool: Promise<Pool>;
  private readonly connectionString: string | undefined;

  constructor(private poolOrUrl: string | Promise<Pool> | Pool) {
    types.setTypeParser(1700, val => parseFloat(val));
    types.setTypeParser(701, val => parseFloat(val));
    types.setTypeParser(20, val => parseInt(val));

    if (typeof poolOrUrl === 'string') {
      this.connectionString = poolOrUrl;
      this.pool = Promise.resolve(new Pool({
        connectionString: poolOrUrl,
        connectionTimeoutMillis: 10000,
        keepAlive: true,
        max: 20,
        idleTimeoutMillis: 10000,
      }));
    } else if (poolOrUrl instanceof Promise) {
      this.pool = poolOrUrl;
    } else {
      this.pool = Promise.resolve(poolOrUrl);
    }
  }

  async close() {
    const pool = await this.pool;
    await pool.end();
  }

  private async run<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
    let client: PoolClient | null = null;
    try {
      const pool = await this.pool;
      client = await pool.connect();
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

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.run(async client => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.execRaw(sql, values);
    });
  }

  exec(sql: any): Promise<RelationalRawResult> {
    return this.run(async client => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.exec(sql as any);
    });
  }

  supportsQuery(sql: any): boolean {
    return postgresFormatter.canHandle(sql);
  }
}
