import { Client, Pool, PoolClient, QueryResult, types } from 'pg';
import { postgresFormatter } from '../formatters/postgres-formatter';
import { PostgresFormatContext } from './postgres-format-context';
import { DuplicateKeyError, RelationDoesNotExistsError, UnknownError } from '@daita/relational';
import { RelationalRawResult } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { createLogger } from '@daita/common';
import { ConnectionError } from '@daita/relational';

export class PostgresDataAdapter implements RelationalDataAdapter {
  protected readonly logger = createLogger({ package: 'pg-adapter' });

  constructor(protected client: PoolClient | Pool) {}

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    this.logger.debug('execute raw sql', { query: sql, queryValues: values });
    return await this.mapError(this.client.query(sql, values), sql, values);
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const result = this.formatQuery(sql);
    this.logger.debug('execute sql', { sql, query: result.sql, queryValues: result.values });
    return await this.mapError(this.client.query(result.sql, result.values), result.sql, result.values);
  }

  private formatQuery(query: any): { sql: string; values: any[] } {
    const formatCtx = new PostgresFormatContext();
    const sql = postgresFormatter.format(query, formatCtx);
    return { sql, values: formatCtx.getValues() };
  }

  private async mapError(run: Promise<QueryResult<any>>, sql: string, values: any[]): Promise<RelationalRawResult> {
    try {
      const result = await run;
      return { rows: result.rows, rowCount: result.rowCount };
    } catch (e) {
      this.logger.trace(e, { query: sql, queryValues: values });
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
      if (e.errno === -111 || e.message === 'Client has encountered a connection error and is not queryable') {
        throw new ConnectionError('TODO', e); // TODO change after db connection string parse rewrite
      }
      if (e.code === '42P01') {
        const regex = /.+"(?<schema>.*?)\.?(?<relation>.*?)" does not exist/g;
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