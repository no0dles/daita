import {PoolClient} from 'pg';
import * as debug from 'debug';
import {SqlQuery} from '@daita/core/dist/sql/sql-query';
import {RelationalRawResult} from '@daita/core/dist/adapter/relational-raw-result';
import {SqlQueryBuilder} from '@daita/core/dist/sql/sql-query-builder';
import {SqlDmlBuilder} from '@daita/core/dist/sql/sql-dml-builder';
import {RelationalDataAdapter} from '@daita/core';
import {SqlDmlQuery} from '@daita/core/dist/sql/sql-dml-builder';
import {isSqlQuery} from '@daita/core/dist/sql/sql-query';

export class PostgresDataAdapter implements RelationalDataAdapter {

  constructor(private client: PoolClient) {

  }

  async raw(sql: SqlQuery | SqlDmlQuery | string, values?: any[]): Promise<RelationalRawResult> {
    if (typeof sql === 'string') {
      debug('daita:postgres')(sql);
      return await this.mapError(this.client.query(sql, values || []));
    } else {
      if (isSqlQuery(sql)) {
        const sqlBuilder = new SqlQueryBuilder(sql);
        debug('daita:postgres')(sqlBuilder.sql);
        return await this.mapError(this.client.query(sqlBuilder.sql, sqlBuilder.values));
      } else {
        const sqlBuilder = new SqlDmlBuilder(sql);
        debug('daita:postgres')(sqlBuilder.sql);
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
      debug('daita:postgres')(e.message);
      throw e;
    }
  }
}
