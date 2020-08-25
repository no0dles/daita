import { PoolClient, QueryResult } from 'pg';
import {
  RelationalDataAdapter,
  RelationalRawResult,
} from '@daita/relational';
import { postgresFormatter } from './postgres-formatter';
import { PostgresFormatContext } from './postgres-format-context';

export class PostgresDataAdapter implements RelationalDataAdapter {

  constructor(private client: PoolClient) {

  }

  async close(): Promise<void> {
    this.client.release();
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return await this.mapError(this.client.query(sql, values));
  }

  async exec(query: any): Promise<RelationalRawResult> {
    const result = this.formatQuery(query);
    return await this.execRaw(result.sql, result.values);
  }

  private formatQuery(query: any): { sql: string, values: any[] } {
    const formatCtx = new PostgresFormatContext();
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
      if (e.code === '42P01') {
        throw new Error(`table ${e.message} does not exists`); //extract table name
      }
      throw e;
    }
  }

  supportsQuery(sql: any): boolean {
    return postgresFormatter.canHandle(sql);
  }
}
