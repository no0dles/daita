import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { Sql } from '../../relational/sql/sql';
import { createPool, Pool } from 'mariadb';
import { MariadbSql } from '../sql/mariadb-sql';
import { mariadbFormatter } from '../formatter/mariadb-formatter';
import { MariadbFormatContext } from '../formatter/mariadb-format-context';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';

export class MariadbRelationalDataAdapter implements RelationalDataAdapter<MariadbSql> {
  constructor(protected pool: Pool) {}

  async close(): Promise<void> {
    await this.pool.end();
  }

  exec(sql: Sql<any>): Promise<RelationalRawResult> {
    const ctx = new MariadbFormatContext();
    const query = mariadbFormatter.format(sql, ctx);
    return this.execRaw(query, ctx.getValues());
  }

  async execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    const result = await this.pool.query(sql, values);
    return {
      rows: result,
      rowCount: result.length,
    };
  }

  supportsQuery<S>(sql: S): this is RelationalDataAdapter<Sql<any> | S> {
    return mariadbFormatter.canHandle(sql);
  }
}

export class MariadbRelationalTransactionAdapter
  extends MariadbRelationalDataAdapter
  implements RelationalTransactionAdapter<MariadbSql> {
  async transaction<T>(action: (adapter: RelationalDataAdapter<MariadbSql>) => Promise<T>): Promise<T> {
    const connection = await this.pool.getConnection();
    try {
    } catch (e) {
    } finally {
    }
  }
}
