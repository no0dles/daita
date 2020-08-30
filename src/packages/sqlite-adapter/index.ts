import * as sqlite from 'sqlite3';
import { sqliteFormatter } from './sqlite-formatter';
import { SqliteFormatContext } from './sqlite-format-context';
import {
  CreateAdapterOptions,
  CreateDataAdapterOptions,
  CreateTransactionAdapterOptions,
  DestroyAdapterOptions,
  RelationalDataAdapterFactory,
  RelationalTransactionAdapterFactory,
} from '../relational/adapter/factory';
import {RelationalDataAdapter, RelationalRawResult, RelationalTransactionAdapter} from '../relational/adapter';
import {Defer} from '../common/utils';

export interface SerializableAction<T> {
  (): Promise<T> | T;
}

export interface SerializableQueueItem<T> {
  action: SerializableAction<T>;
  defer: Defer<T>;
}

class Serializable {
  private nextActions: SerializableQueueItem<any>[] = [];
  private currentAction: SerializableQueueItem<any> | null = null;

  run<T>(action: SerializableAction<T>): Promise<T> {
    const defer = new Defer<T>();
    const item: SerializableQueueItem<T> = { action, defer };
    if (this.currentAction) {
      this.nextActions.push(item);
    } else {
      this.execute(item);
    }
    return defer.promise;
  }

  private async execute(queueItem: SerializableQueueItem<any>) {
    this.currentAction = queueItem;
    try {
      const result = await this.currentAction.action();
      this.currentAction.defer.resolve(result);
    } catch (e) {
      this.currentAction.defer.reject(e);
    }

    const nextAction = this.nextActions.shift();
    if (!nextAction) {
      this.currentAction = null;
      return;
    }
    this.execute(nextAction);
  }
}

export class SqliteRelationalDataAdapter implements RelationalDataAdapter {
  protected transactionSerializable = new Serializable();
  protected runSerializable = new Serializable();

  constructor(protected db: sqlite.Database) {
    this.db.on('error', (err) => {
      console.log('onerr', err);
    });
    this.db.on('close', () => {
      console.log('close', arguments);
    })
    this.db.on('open', () => {
      console.log('open', arguments);
    });
    this.db.on('trace', () => {
      console.log('trace', arguments);
    });
  }

  async close(): Promise<void> {
    const defer = new Defer<void>();
    this.db.close(err => {
      if (err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    await defer.promise;
  }

  protected async run(sql: string, values?: any[]) {
    return this.runSerializable.run(() => {
      const defer = new Defer<void>();
      this.db.run(sql, values, err => {
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
        stmt.bind(err => {
          console.log(err);
        });
        stmt.all(values, (err, rows) => {
          if (err) {
            defer.reject(err);
          } else {
            defer.resolve({
              rows: rows.map(row => {
                for (const key of Object.keys(row)) {
                  if (typeof row[key] === 'string' && /[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}.[0-9]{3}Z/.test(row[key])) {
                    row[key] = new Date(row[key]);
                  }
                }
                return row;
              }),
              rowCount: rows.length,
            });
          }
        });
        stmt.finalize(err => {
          if (err) {
            defer.reject(err);
          }
        })
      });
      return defer.promise;
    });
  }

  supportsQuery(sql: any): boolean {
    return sqliteFormatter.canHandle(sql);
  }
}

export class SqliteRelationalAdapter extends SqliteRelationalDataAdapter implements RelationalTransactionAdapter {
  constructor(private fileName: string) {
    super(new (sqlite.verbose()).Database(fileName));
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

export const adapterFactory: RelationalDataAdapterFactory & RelationalTransactionAdapterFactory = {
  async createTransactionAdapter(options?: CreateTransactionAdapterOptions): Promise<RelationalTransactionAdapter> {
    const fileName = await getFileName(options);
    return new SqliteRelationalAdapter(fileName);
  },
  async createDataAdapter(options?: CreateDataAdapterOptions): Promise<RelationalDataAdapter> {
    const fileName = await getFileName(options);
    return new SqliteRelationalAdapter(fileName);
  },
  async destroy(options?: DestroyAdapterOptions): Promise<void> {

  },
  name: '@daita/sqlite-adapter',
  canCreate(connectionString: string): boolean {
    return connectionString === ':memory:' || connectionString.startsWith('.' || connectionString.startsWith('sqlite:'));
  },
};

function getFileName(options?: CreateAdapterOptions) {
  const connectionString = options?.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('missing connection string');
  }
  return connectionString;
}
