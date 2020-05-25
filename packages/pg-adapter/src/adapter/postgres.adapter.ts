import {Pool, PoolClient, types} from 'pg';
import {PostgresDataAdapter} from './postgres-data-adapter';
import {
  RelationalDataAdapter,
  RelationalTransactionAdapter,
  RelationalRawResult,
} from "@daita/relational";
import {
  isPostgresQuery,
  PostgresQuery,
} from "../query/postgres-query";

export class PostgresAdapter implements RelationalTransactionAdapter {
  private readonly pool: Pool;
  private readonly connectionString: string | undefined;

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

  private async run<T>(action: (client: PoolClient) => Promise<T>): Promise<T> {
    let client: PoolClient | null = null;
    try {
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

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.run(async client => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.execRaw(sql, values);
    });
  }

  exec(sql: PostgresQuery): Promise<RelationalRawResult> {
    return this.run(async client => {
      const adapter = new PostgresDataAdapter(client);
      return adapter.exec(sql as any);
    });
  }

  supportsQuery(sql: any): boolean {
    return isPostgresQuery(sql);
  }
}
