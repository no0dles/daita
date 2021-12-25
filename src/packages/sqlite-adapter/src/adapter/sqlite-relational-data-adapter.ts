import { RelationalDataAdapter } from '@daita/relational';
import { Database } from 'sqlite3';
import { Defer } from '@daita/common';
import { RelationalRawResult } from '@daita/relational';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { Serializable } from './serializable';
import { SqliteSql } from '../sql/sqlite-sql';
import { createLogger } from '@daita/common';
import { RelationDoesNotExistsError } from '@daita/relational';
import { Resolvable } from '@daita/common';
import { parseJson } from '@daita/common';

export class SqliteRelationalDataAdapter implements RelationalDataAdapter<SqliteSql> {
  protected readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected db: Resolvable<Database>) {}

  async close(): Promise<void> {
    await this.db.close();
  }

  protected async run(sql: string, values?: any[]) {
    return this.runSerializable.run(async () => {
      const defer = new Defer<void>();
      const db = await this.db.get();
      db.run(sql, values, (err) => {
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
      const db = await this.db.get();
      const logger = this.logger;

      if (!sql.toLowerCase().startsWith('select')) {
        db.run(sql, values, function (err) {
          if (err) {
            const regex = /SQLITE_ERROR\: no such table\: (?<table>.*)/g;
            const groups = regex.exec(err.message)?.groups || {};
            if (groups.table) {
              return defer.reject(new RelationDoesNotExistsError(err, sql, values, undefined, groups.table));
            }
            return defer.reject(err);
          } else {
            defer.resolve({
              rows: [],
              rowCount: this.changes,
            });
          }
        });
      } else {
        const stmt = db.prepare(sql, values, function (err) {
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
              logger.error(err, { query: sql, queryValues: values });
              defer.reject(err);
            }
          });
          stmt.all(values, function (err, rows) {
            if (err) {
              logger.error(err, { query: sql, queryValues: values });
              defer.reject(err);
            } else {
              logger.trace(`all statement ${sql}`, { sql, values, rows });
              defer.resolve({
                rows: rows.map((row) => {
                  const columnKeys = Object.keys(row);
                  for (const columnKey of columnKeys) {
                    const columnValue = row[columnKey];
                    if (typeof columnValue === 'string' && columnValue.startsWith('JSON-')) {
                      row[columnKey] = parseJson(columnValue.substr('JSON-'.length));
                    } else if (
                      typeof columnValue === 'string' &&
                      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}(Z){0,1}$/.test(columnValue)
                    ) {
                      row[columnKey] = new Date(columnValue);
                    } else if (typeof columnValue === 'string' && columnValue.startsWith('BOOL-')) {
                      row[columnKey] = columnValue.substr('BOOL-'.length) === 'true';
                    }
                    //TODO improve and document, make tests with text values BOOL-, JSON-, DATE- and wrong formats
                  }
                  return row;
                }),
                rowCount: rows.length,
              });
            }
          });
          stmt.finalize(function (err) {
            if (err) {
              logger.error(err, { query: sql, queryValues: values });
              defer.reject(err);
            } else {
              logger.trace(`finalize statement ${sql}`, { sql, values });
            }
          });
          setTimeout(() => {
            if (!defer.isRejected && !defer.isResolved) {
              logger.warn(`sql ${sql} took more than 10s`, { sql, values });
            }
          }, 10000);
        });
      }
      return defer.promise;
    });
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}
