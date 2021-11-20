import { RelationalTransactionAdapter } from '@daita/relational/adapter/relational-transaction-adapter';
import { MariadbSql } from '../sql/mariadb-sql';
import { Resolvable } from '@daita/common/utils/resolvable';
import { Pool } from 'mariadb';
import { RelationalDataAdapter } from '@daita/relational/adapter/relational-data-adapter';
import { MariadbRelationalDataAdapter } from './mariadb-relational-data-adapter';

export class MariadbRelationalTransactionAdapter
  extends MariadbRelationalDataAdapter
  implements RelationalTransactionAdapter<MariadbSql> {
  constructor(protected pool: Resolvable<Pool>) {
    super(pool);
  }
  async transaction<T>(action: (adapter: RelationalDataAdapter<MariadbSql>) => Promise<T>): Promise<T> {
    const pool = await this.pool.get();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const adapter = new MariadbRelationalDataAdapter(new Resolvable(connection));
      const result = await action(adapter);
      await connection.commit();
      return result;
    } catch (e) {
      await connection.rollback();
      throw e;
    } finally {
      connection.release();
    }
  }
}
