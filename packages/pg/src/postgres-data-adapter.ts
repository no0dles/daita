import {PoolClient} from 'pg';
import * as debug from 'debug';
import {RelationalDataAdapter, RelationalBaseAdapter, SqlDmlQuery} from '@daita/core';
import {SqlQuery} from '@daita/core/dist/sql/sql-query';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';
import {SqlQueryBuilder} from '@daita/core/dist/sql/sql-query-builder';
import {SqlDmlBuilder} from '@daita/core/dist/sql/sql-dml-builder';

export class PostgresDataAdapter extends RelationalBaseAdapter
  implements RelationalDataAdapter {

  constructor(private client: PoolClient) {
    super();
  }

  isKind(kind: 'data' | 'migration' | 'transaction'): boolean {
    return kind === 'data';
  }

  protected async runQuery(sql: SqlQuery | SqlDmlQuery | string, values?: any[]): Promise<RelationalRawResult> {
    if (typeof sql === 'string') {
      debug('daita:core:postgres')(sql);
      return await this.mapError(this.client.query(sql, values || []));
    } else {
      if ((<any>sql).insert || (<any>sql).select || (<any>sql).update || (<any>sql).delete) {
        const sqlBuilder = new SqlQueryBuilder(sql as SqlQuery);
        debug('daita:core:postgres')(sqlBuilder.sql);
        return await this.mapError(this.client.query(sqlBuilder.sql, sqlBuilder.values));
      } else {
        const sqlBuilder = new SqlDmlBuilder(sql as SqlDmlQuery);
        debug('daita:core:postgres')(sqlBuilder.sql);
        return await this.mapError(this.client.query(sqlBuilder.sql, []));
      }
    }
  }

  private async mapError<T>(run: Promise<T>): Promise<T> {
    try {
      const result = await run;
      return result;
    } catch (e) {
      if (e.code === '23505') {
        throw new Error('primary key already exists');
      }
      debug('daita:core:postgres')(e.message);
      throw e;
    }
  }
}