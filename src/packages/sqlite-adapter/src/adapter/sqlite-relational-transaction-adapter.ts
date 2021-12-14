import { RelationalTransactionAdapter } from '@daita/relational';
import { RelationalDataAdapter } from '@daita/relational';
import { SqliteRelationalDataAdapter } from './sqlite-relational-data-adapter';
import { SqliteSql } from '../sql/sqlite-sql';
import { Resolvable } from '@daita/common';
import { Defer } from '@daita/common';
import { Database } from 'sqlite3';

export class SqliteRelationalTransactionAdapter
  extends SqliteRelationalDataAdapter
  implements RelationalTransactionAdapter<SqliteSql>
{
  constructor(protected connectionString: Resolvable<string>) {
    super(
      new Resolvable(
        async () => {
          const fileName = await connectionString.get();
          const db = new Database(fileName);
          db.on('error', (err) => {
            this.logger.error(err);
          });
          db.on('close', () => {
            this.logger.debug('database closed');
          });
          db.on('open', () => {
            this.logger.debug('database opened');
          });
          return db;
        },
        async (db) => {
          if (!db) {
            return;
          }

          const defer = new Defer<void>();
          db.close((err) => {
            if (err && (<any>err).errno !== 21) {
              defer.reject(err);
            } else {
              defer.resolve();
            }
          });
          await defer.promise;
        },
      ),
    );
  }

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
    return this.transactionSerializable.run(async () => {
      const db = await this.db.get();
      await db.run('BEGIN');
      try {
        const result = await action(new SqliteRelationalDataAdapter(new Resolvable<Database>(db)));
        await this.run('COMMIT');
        return result;
      } catch (e) {
        await this.run('ROLLBACK');
        throw e;
      }
    });
  }

  async close(): Promise<void> {
    await super.close();
    await this.connectionString.close();
  }
}
