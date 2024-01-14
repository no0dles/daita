import { Client, Pool, PoolClient, QueryResult } from 'pg';
import { postgresFormatter } from '../formatters/postgres-formatter';
import { PostgresFormatContext } from './postgres-format-context';
import {
  BaseRelationalTransactionAdapter,
  DuplicateKeyError,
  RelationalTransactionAdapter,
  RelationDoesNotExistsError,
  UnknownError,
} from '@daita/relational';
import { RelationalRawResult } from '@daita/relational';
import { createLogger, Logger } from '@daita/common';
import { ConnectionError } from '@daita/relational';
import { PostgresSql } from '../sql';

export async function mapError(
  logger: Logger,
  run: Promise<QueryResult<any>>,
  sql: string,
  values: any[],
): Promise<RelationalRawResult> {
  try {
    const result = await run;
    return { rows: result.rows, rowCount: result.rowCount };
  } catch (e: any) {
    logger.trace(e, { query: sql, queryValues: values });
    if (e.code === '23505') {
      throw new DuplicateKeyError(e, sql, values, e.schema, e.table, e.constraint);
    }
    if (e.code === '42P01') {
      const regex = /.+"(?<schema>.*?)\.?(?<relation>.*?)" does not exist/g;
      const groups = regex.exec(e.message)?.groups || {};
      throw new RelationDoesNotExistsError(e, sql, values, groups.schema, groups.relation);
    }

    throw parseError(e)
  }
}

export function parseError(e: any) {
  if (
    e.code === 'ECONNREFUSED' ||
    e.errno === -61 ||
    e.errno === -54 ||
    e.errno === -111 ||
    e.message === 'Client has encountered a connection error and is not queryable'
  ) {
    return new ConnectionError('TODO', e); // TODO change after db connection string parse rewrite
  }
  return new UnknownError(e);
}

export async function exec(logger: Logger, client: PoolClient | Client | Pool, sql: any) {
  const result = formatQuery(sql);
  logger.debug('execute sql', { sql, query: result.sql, queryValues: result.values });
  return await mapError(logger, client.query(result.sql, result.values), result.sql, result.values);
}

export async function execRaw(logger: Logger, client: PoolClient | Client | Pool, sql: string, values: any[]) {
  logger.debug('execute raw sql', { query: sql, queryValues: values });
  return await mapError(logger, client.query(sql, values), sql, values);
}

export function formatQuery(query: any) {
  const formatCtx = new PostgresFormatContext();
  const sql = postgresFormatter.format(query, formatCtx);
  return { sql, values: formatCtx.getValues() };
}

export class PostgresTransactionAdapter
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<PostgresSql>
{
  protected readonly logger = createLogger({ package: 'pg-adapter' });
  private executions: (() => Promise<any>)[] = [];

  constructor(private client: PoolClient) {
    super();
  }

  execRaw(sql: string, values: any[]): void {
    this.executions.push(() => execRaw(this.logger, this.client, sql, values));
  }

  exec(sql: any): void {
    this.executions.push(() => exec(this.logger, this.client, sql));
  }

  async run(): Promise<void> {
    for (const execution of this.executions) {
      await execution();
    }
  }

  async close(): Promise<void> {
    this.client.release();
  }

  supportsQuery(sql: any): boolean {
    return postgresFormatter.canHandle(sql);
  }
}
