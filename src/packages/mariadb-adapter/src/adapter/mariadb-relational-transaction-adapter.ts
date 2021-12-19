import { RelationalTransactionAdapter } from '@daita/relational';
import { MariadbSql } from '../sql/mariadb-sql';
import { handleTimeout, Resolvable } from '@daita/common';
import { Pool } from 'mariadb';
import { RelationalDataAdapter } from '@daita/relational';
import { MariadbRelationalDataAdapter } from './mariadb-relational-data-adapter';

export class MariadbRelationalTransactionAdapter
  extends MariadbRelationalDataAdapter
  implements RelationalTransactionAdapter<MariadbSql>
{
  constructor(protected pool: Resolvable<Pool>) {
    super(pool);
  }
  async transaction<T>(
    action: (adapter: RelationalDataAdapter<MariadbSql>) => Promise<T>,
    timeout?: number,
  ): Promise<T> {
    const pool = await this.pool.get();
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      const adapter = new MariadbRelationalDataAdapter(new Resolvable(connection));
      const result = await handleTimeout(() => action(adapter), timeout);
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
