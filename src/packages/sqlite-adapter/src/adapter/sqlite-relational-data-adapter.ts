import { RelationalDataAdapter } from '@daita/relational';
import { Database } from 'sqlite3';
import { RelationalRawResult } from '@daita/relational';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { Serializable } from './serializable';
import { SqliteSql } from '../sql/sqlite-sql';
import { createLogger } from '@daita/common';
import { RelationDoesNotExistsError } from '@daita/relational';
import { parseJson } from '@daita/common';

export class SqliteRelationalDataAdapter implements RelationalDataAdapter<SqliteSql> {
  protected readonly logger = createLogger({ adapter: 'sqlite', package: 'sqlite' });
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected readonly db: Database) {}

  async close(): Promise<void> {
    const db = await this.db;
    return new Promise<void>((resolve, reject) => {
      db.close((err) => {
        if (err && (<any>err).errno !== 21) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  protected async run(sql: string, values?: any[]) {
    return this.runSerializable.run(async () => {
      const db = await this.db;
      return new Promise<void>((resolve, reject) => {
        db.run(sql, values, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
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
      const db = await this.db;
      return new Promise<RelationalRawResult>((resolve, reject) => {
        this.logger.trace(`execute statement ${sql}`, { sql, values });
        const logger = this.logger;

        if (!sql.toLowerCase().startsWith('select')) {
          db.run(sql, values, function (err) {
            if (err) {
              const regex = /SQLITE_ERROR: no such table: (?<table>.*)/g;
              const groups = regex.exec(err.message)?.groups || {};
              if (groups.table) {
                return reject(new RelationDoesNotExistsError(err, sql, values, undefined, groups.table));
              }
              return reject(err);
            } else {
              resolve({
                rows: [],
                rowCount: this.changes,
              });
            }
          });
        } else {
          const timeout = setTimeout(() => {
            logger.warn(`sql ${sql} took more than 10s`, { sql, values });
          }, 10000);
          const stmt = db.prepare(sql, values, function (err) {
            if (err) {
              const regex = /SQLITE_ERROR: no such table: (?<table>.*)/g;
              const groups = regex.exec(err.message)?.groups || {};
              if (groups.table) {
                return reject(new RelationDoesNotExistsError(err, sql, values, undefined, groups.table));
              }
              clearTimeout(timeout);
              return reject(err);
            }

            stmt.bind((err) => {
              if (err) {
                logger.error(err, { query: sql, queryValues: values });
                clearTimeout(timeout);
                reject(err);
              }
            });
            stmt.all(values, function (err, rows) {
              if (err) {
                logger.error(err, { query: sql, queryValues: values });
                clearTimeout(timeout);
                reject(err);
              } else {
                logger.trace(`all statement ${sql}`, { sql, values, rows });
                clearTimeout(timeout);
                resolve({
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
                clearTimeout(timeout);
                reject(err);
              } else {
                logger.trace(`finalize statement ${sql}`, { sql, values });
              }
            });
          });
        }
      });
    });
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}
