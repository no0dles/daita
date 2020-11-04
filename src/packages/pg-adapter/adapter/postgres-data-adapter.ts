import { PoolClient, QueryResult } from 'pg';
import { postgresFormatter } from './postgres-formatter';
import { PostgresFormatContext } from './postgres-format-context';
import { DuplicateKeyError, RelationDoesNotExistsError, UnknownError } from '../../relational/error/relational-error';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';

export class PostgresDataAdapter implements RelationalDataAdapter {
  constructor(private client: PoolClient) {}

  async close(): Promise<void> {
    this.client.release();
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return await this.mapError(this.client.query(sql, values), sql, values);
  }

  async exec(query: any): Promise<RelationalRawResult> {
    const result = this.formatQuery(query);
    return await this.execRaw(result.sql, result.values);
  }

  private formatQuery(query: any): { sql: string; values: any[] } {
    const formatCtx = new PostgresFormatContext();
    const sql = postgresFormatter.format(query, formatCtx);
    console.log(sql, formatCtx.getValues());
    return { sql, values: formatCtx.getValues() };
  }

  private async mapError(run: Promise<QueryResult<any>>, sql: string, values: any[]): Promise<RelationalRawResult> {
    try {
      const result = await run;
      return { rows: result.rows, rowCount: result.rowCount };
    } catch (e) {
      console.log(sql, values, e);
      if (e.code === '23505') {
        const regex = /Key \((?<keys>.*?)\)=\((?<values>.*?)\) already exists./g;
        const groups = regex.exec(e.message)?.groups || {};
        const keys = groups.keys?.split(',').map((k) => k.trim()) || [];
        const values = groups.values?.split(',').map((k) => k.trim()) || [];
        const obj: any = {};
        for (let i = 0; i < keys.length; i++) {
          obj[keys[i]] = values[i];
        }
        throw new DuplicateKeyError(e, sql, values, e.schema, e.table, e.constraint, obj);
      }
      if (e.code === '42P01') {
        const regex = /(Error:\s)?(\w+\s)?(R|r)elation "(?<schema>.*?)\.?(?<relation>.*?)" does not exist/g;
        const groups = regex.exec(e.message)?.groups || {};
        throw new RelationDoesNotExistsError(e, sql, values, groups.schema, groups.relation);
      }
      throw new UnknownError(e, sql, values);
    }
  }

  supportsQuery(sql: any): boolean {
    return postgresFormatter.canHandle(sql);
  }
}
