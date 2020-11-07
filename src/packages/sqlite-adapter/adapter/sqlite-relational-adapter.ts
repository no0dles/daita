import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import * as sqlite from 'sqlite3';
import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import { SqliteRelationalDataAdapter } from './sqlite-relational-data-adapter';

export class SqliteRelationalAdapter extends SqliteRelationalDataAdapter implements RelationalTransactionAdapter {
  constructor(private fileName: string) {
    super(new (sqlite.verbose().Database)(fileName));
  }

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    return this.transactionSerializable.run(async () => {
      await this.db.run('BEGIN');
      try {
        const result = await action(new SqliteRelationalDataAdapter(this.db));
        await this.run('COMMIT');
        return result;
      } catch (e) {
        await this.run('ROLLBACK');
        throw e;
      }
    });
  }
}
