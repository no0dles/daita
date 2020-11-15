import { RelationalDataAdapter } from '../../relational/adapter/relational-data-adapter';
import * as sqlite from 'sqlite3';
import { Defer } from '../../common/utils/defer';
import { RelationalRawResult } from '../../relational/adapter/relational-raw-result';
import { SqliteFormatContext } from '../formatter/sqlite-format-context';
import { sqliteFormatter } from '../formatter/sqlite-formatter';
import { Serializable } from './serializable';
import { SqliteSql } from '../sql/sqlite-sql';

export class SqliteRelationalDataAdapter implements RelationalDataAdapter<SqliteSql> {
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected db: sqlite.Database, private closeFn: () => void) {
    this.db.on('error', (err) => {
      console.log('onerr', err);
    });
    this.db.on('close', () => {
      //console.log('close', arguments);
    });
    this.db.on('open', () => {
      //console.log('open', arguments);
    });
    this.db.on('trace', () => {
      //console.log('trace', arguments);
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
    console.log(query);
    return await this.execRaw(query, ctx.getValues());
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.runSerializable.run<RelationalRawResult>(async () => {
      const defer = new Defer<RelationalRawResult>();
      const stmt = this.db.prepare(sql, values, () => {
        stmt.bind((err) => {
          console.log(err);
        });
        stmt.all(values, (err, rows) => {
          if (err) {
            defer.reject(err);
          } else {
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
            defer.reject(err);
          }
        });
      });
      return defer.promise;
    });
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}
