import { RelationalDataAdapter } from '@daita/relational/adapter/relational-data-adapter';
import * as sqlite from 'sqlite3';
import { Defer } from '@daita/common/utils/defer';
import { RelationalRawResult } from '@daita/relational/adapter/relational-raw-result';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { Serializable } from './serializable';
import { SqliteSql } from '../sql/sqlite-sql';
import { createLogger } from '@daita/common/utils/logger';
import { RelationDoesNotExistsError } from '@daita/relational/error/relational-error';
import { Resolvable } from '@daita/common/utils/resolvable';
import { parseJson } from '@daita/common/utils/json';

export class SqliteRelationalDataAdapter implements RelationalDataAdapter<SqliteSql> {
  protected readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected db: Resolvable<sqlite.Database>) {}

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
      const stmt = db.prepare(sql, values, (err) => {
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
                const columnKeys = Object.keys(row);
                for (const columnKey of columnKeys) {
                  const columnValue = row[columnKey];
                  if (typeof columnValue === 'string' && columnValue.startsWith('JSON-')) {
                    row[columnKey] = parseJson(columnValue.substr('JSON-'.length));
                  } else if (typeof columnValue === 'string' && columnValue.startsWith('DATE-')) {
                    row[columnKey] = new Date(columnValue.substr('DATE-'.length));
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
