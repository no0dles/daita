import * as sqlite from "sqlite3";
import {
  CreateAdapterOptions,
  CreateDataAdapterOptions, CreateMigrationAdapterOptions, CreateTransactionAdapterOptions, DestroyAdapterOptions,
  isSqlQuery, RelationalDataAdapter, RelationalDataAdapterFactory,
  RelationalMigrationAdapter, RelationalMigrationAdapterFactory,
  RelationalMigrationTransactionAdapter,
  RelationalRawResult, RelationalTransactionAdapterFactory, SqlDmlBuilder,
  SqlQuery, SqlQueryBuilder
} from "@daita/relational";
import { Defer } from "@daita/common";

export class SqliteRelationalDataAdapter implements RelationalDataAdapter {
  constructor(protected db: sqlite.Database) {
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

  protected async run(sql: string) {
    const defer = new Defer<void>();
    this.db.run(sql, err => {
      if(err) {
        defer.reject(err);
      } else {
        defer.resolve();
      }
    });
    return defer.promise;
  }

  protected serialize<T>(action: () => Promise<T>): Promise<T> {
    const defer = new Defer<T>();
    this.db.serialize(async() => {
      try {
        const result = await action();
        defer.resolve(result);
      } catch (e) {
        defer.reject(e);
      }
    });
    return defer.promise;
  }

  async exec(sql: SqlQuery): Promise<RelationalRawResult> {
    if (isSqlQuery(sql)) {
      const sqlBuilder = new SqlQueryBuilder(sql);
      return await this.execRaw(sqlBuilder.sql, sqlBuilder.values);
    } else {
      const sqlBuilder = new SqlDmlBuilder(sql);
      return await this.execRaw(sqlBuilder.sql, []);
    }
  }

  execRaw(sql: string, values: any[]): Promise<RelationalRawResult> {
    return this.serialize<RelationalRawResult>(async () => {
      const defer = new Defer<RelationalRawResult>();
      const stmt = this.db.prepare(sql);
      stmt.all(values, (err, rows) => {
        if (err) {
          defer.reject(err);
        } else {
          defer.resolve({ rows, rowCount: rows.length });
        }
      });
      stmt.finalize(err => {
        if(err) {
          defer.reject(err);
        }
      });
      return defer.promise;
    });
  }
}

export class SqliteRelationalAdapter extends SqliteRelationalDataAdapter implements RelationalMigrationAdapter {
  constructor(private fileName: string) {
    super(new sqlite.Database(fileName));
  }

  transaction<T>(action: (adapter: RelationalMigrationTransactionAdapter) => Promise<T>): Promise<T> {
    return this.serialize<T>(async () => {
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

export const adapterFactory: RelationalDataAdapterFactory & RelationalTransactionAdapterFactory & RelationalMigrationAdapterFactory = {
  async createMigrationAdapter(options?: CreateDataAdapterOptions): Promise<RelationalMigrationAdapter> {
    const fileName = await getFileName(options);
    return new SqliteRelationalAdapter(fileName);
  },
  async createTransactionAdapter(options?: CreateTransactionAdapterOptions): Promise<RelationalMigrationAdapter> {
    const fileName = await getFileName(options);
    return new SqliteRelationalAdapter(fileName);
  },
  async createDataAdapter(options?: CreateMigrationAdapterOptions): Promise<RelationalMigrationAdapter> {
    const fileName = await getFileName(options);
    return new SqliteRelationalAdapter(fileName);
  },
  async destroy(options?: DestroyAdapterOptions): Promise<void> {

  }
};

function getFileName(options?: CreateAdapterOptions) {
  const connectionString = options?.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("missing connection string");
  }
  return connectionString;
}
