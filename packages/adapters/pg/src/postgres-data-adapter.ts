import {PoolClient} from 'pg';
import {
  isSqlQuery,
  RelationalDataAdapter,
  RelationalRawResult,
  SqlDmlBuilder,
  SqlDmlQuery,
  SqlQuery,
  SqlQueryBuilder
} from "@daita/relational";

export class PostgresDataAdapter implements RelationalDataAdapter {

  constructor(private client: PoolClient) {

  }

  async raw(sql: SqlQuery | SqlDmlQuery | string, values?: any[]): Promise<RelationalRawResult> {
    if (typeof sql === 'string') {
      return await this.mapError(this.client.query(sql, values || []));
    } else {
      if (isSqlQuery(sql)) {
        const sqlBuilder = new SqlQueryBuilder(sql);
        return await this.mapError(this.client.query(sqlBuilder.sql, sqlBuilder.values));
      } else {
        const sqlBuilder = new SqlDmlBuilder(sql);
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
      throw e;
    }
  }
}
