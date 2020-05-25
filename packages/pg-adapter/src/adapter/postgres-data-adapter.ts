import { PoolClient, QueryResult } from 'pg';
import {
  CounterFormatContext,
  RelationalDataAdapter,
  RelationalRawResult,
} from '@daita/relational';
import { isPostgresQuery, PostgresQuery } from '../query/postgres-query';
import { postgresFormatter } from '../query/postgres-formatter';

export class PostgresDataAdapter implements RelationalDataAdapter {

  constructor(private client: PoolClient) {

  }

  async close(): Promise<void> {
    this.client.release();
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return await this.mapError(this.client.query(sql, values));
  }

  async exec(query: PostgresQuery): Promise<RelationalRawResult> {
    const result = this.formatQuery(query);
    return await this.execRaw(result.sql, result.values);
  }

  private formatQuery(query: PostgresQuery): { sql: string, values: any[] } {
    const formatCtx = new CounterFormatContext('$');
    const sql = postgresFormatter.format(query, formatCtx);
    console.log(sql, formatCtx.getValues());
    return { sql, values: formatCtx.getValues() };
  }

  private async mapError(run: Promise<QueryResult<any>>): Promise<RelationalRawResult> {
    try {
      const result = await run;
      return { rows: result.rows, rowCount: result.rowCount };
    } catch (e) {
      if (e.code === '23505') {
        throw new Error('primary key already exists');
      }
      throw e;
    }
  }

  supportsQuery(sql: any): boolean {
    return isPostgresQuery(sql);
  }
}
