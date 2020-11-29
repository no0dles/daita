import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import * as sqlite from 'sqlite3';
import { Defer } from '../../common/utils/defer';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { Serializable } from './serializable';
import { SqliteSql } from '../sql/sqlite-sql';
import { createLogger } from '../../common/utils/logger';
import { RelationDoesNotExistsError } from '../../relational/error/relational-error';

export class SqliteRelationalDataAdapter implements RelationalDataAdapter<SqliteSql> {
  private readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected db: sqlite.Database, private closeFn: () => void) {
    this.db.on('error', (err) => {
      this.logger.error(err);
    });
    this.db.on('close', () => {
      this.logger.debug('database closed');
    });
    this.db.on('open', () => {
      this.logger.debug('database opened');
    });
  }

  async close(): Promise<void> {
    const defer = new Defer<void>();
    this.db.close((err) => {
      if (err && (<any>err).errno !== 21) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
      this.closeFn();
    });
    await defer.promise;
  }

  protected async run(sql: string, values?: any[]) {
    return this.runSerializable.run(() => {
      const defer = new Defer<void>();
      this.db.run(sql, values, (err) => {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve();
        }
      });
      return defer.promise;
    });
  }

  async exec(sql: any): Promise<RelationalRawResult> {
    const ctx = new SqliteFormatContext();
    const query = sqliteFormatter.format(sql, ctx);
    this.logger.debug('execute sql', { sql, query, queryValues: ctx.getValues() });
    return await this.execRaw(query, ctx.getValues());
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.runSerializable.run<RelationalRawResult>(async () => {
      const defer = new Defer<RelationalRawResult>();
      this.logger.trace(`execute statement ${sql}`, { sql, values });
      const stmt = this.db.prepare(sql, values, (err) => {
        if (err) {
          const regex = /SQLITE_ERROR\: no such table\: (?<table>.*)/g;
          const groups = regex.exec(err.message)?.groups || {};
          if (groups.table) {
            return defer.reject(new RelationDoesNotExistsError(err, sql, values, undefined, groups.table));
          }
          return defer.reject(err);
        }

        stmt.bind((err) => {
          if (err) {
            this.logger.error(err, { query: sql, queryValues: values });
            defer.reject(err);
          }
        });
        stmt.all(values, (err, rows) => {
          if (err) {
            this.logger.error(err, { query: sql, queryValues: values });
            defer.reject(err);
          } else {
            this.logger.trace(`all statement ${sql}`, { sql, values, rows });
            defer.resolve({
              rows: rows.map((row) => {
                for (const key of Object.keys(row)) {
                  if (
                    typeof row[key] === 'string' &&
                    /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/.test(row[key])
                  ) {
                    row[key] = new Date(row[key]);
                  }
                }
                return row;
              }),
              rowCount: rows.length,
            });
          }
        });
        stmt.finalize((err) => {
          if (err) {
            this.logger.error(err, { query: sql, queryValues: values });
            defer.reject(err);
          } else {
            this.logger.trace(`finalize statement ${sql}`, { sql, values });
          }
        });
        setTimeout(() => {
          if (!defer.isRejected && !defer.isResolved) {
            this.logger.warn(`sql ${sql} took more than 10s`, { sql, values });
          }
        }, 10000);
      });
      return defer.promise;
    });
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}
