import { PoolClient, QueryResult } from "pg";
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

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return await this.mapError(this.client.query(sql, values));
  }
  
  async exec(sql: SqlQuery | SqlDmlQuery): Promise<RelationalRawResult> {
    if (isSqlQuery(sql)) {
      const sqlBuilder = new SqlQueryBuilder(sql);
      return await this.execRaw(sqlBuilder.sql, sqlBuilder.values);
    } else {
      const sqlBuilder = new SqlDmlBuilder(sql);
      return await this.execRaw(sqlBuilder.sql, []);
    }
  }

  private async mapError(run: Promise<QueryResult<any>>): Promise<RelationalRawResult> {
    try {
      const result = await run;
      return {rows: result.rows, rowCount: result.rowCount };
    } catch (e) {
      if (e.code === '23505') {
        throw new Error('primary key already exists');
      }
      throw e;
    }
  }
}
