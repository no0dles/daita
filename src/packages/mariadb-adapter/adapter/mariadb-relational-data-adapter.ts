import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { Sql } from '../../relational/sql/sql';
import { Pool, PoolConnection } from 'mariadb';
import { MariadbSql } from '../sql/mariadb-sql';
import { mariadbFormatter } from '../formatter/mariadb-formatter';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';
import { Resolvable } from '../../common/utils/resolvable';

export class MariadbRelationalDataAdapter implements RelationalDataAdapter<MariadbSql> {
  constructor(protected pool: Resolvable<Pool> | Resolvable<PoolConnection>) {}

  toString() {
    return 'mariadb';
  }

  async close(): Promise<void> {
    await this.pool.close();
  }

  exec(sql: Sql<any>): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const pool = await this.pool.get();
    const result = await pool.query(sql, values);
    return {
      rows: result instanceof Array ? [...result] : [],
      rowCount: result instanceof Array ? result.length : result.affectedRows,
    };
  }

  supportsQuery<S>(sql: S): this is RelationalDataAdapter<Sql<any> | S> {
    return mariadbFormatter.canHandle(sql);
  }
}
