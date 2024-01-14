import { BaseRelationalTransactionAdapter, RelationalTransactionAdapter } from '@daita/relational';
import { Database } from 'better-sqlite3';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { SqliteSql } from '../sql/sqlite-sql';
import { createLogger } from '@daita/common';

export class SqliteRelationalTransactionAdapter
  extends BaseRelationalTransactionAdapter
  implements RelationalTransactionAdapter<SqliteSql>
{
  protected readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });

  constructor(protected readonly db: Database) {
    super();
  }

  exec(sql: any): void {
    const ctx = new SqliteFormatContext();
    const query = sqliteFormatter.format(sql, ctx);
    this.execRaw(query, ctx.getValues());
  }

  execRaw(sql: string, values: any[]): void {
    this.logger.debug('execute sql', { sql, queryValues: values });
    try {
      const statement = this.db.prepare(sql);
      statement.run(values);
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(`${e.message}: ${sql}, ${values}`);
      } else {
        throw new Error(`${e}: ${sql}, ${values}`);
      }
    }
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}
