import * as sqlite from "sqlite3";
import {
  CreateAdapterOptions, CreateDataAdapterOptions,
  CreateTransactionAdapterOptions, DestroyAdapterOptions,
  isSqlQuery, RelationalDataAdapter, RelationalDataAdapterFactory,
  RelationalRawResult, RelationalTransactionAdapter, RelationalTransactionAdapterFactory, SimpleFormatContext,
  SqlQuery,
} from '@daita/relational';
import { Defer } from "@daita/common";
import { isSqlDelete } from '@daita/relational/dist/sql/dml/delete/sql-delete';
import { isSqlSelect } from '@daita/relational/dist/sql/dml/select/sql-select';
import { isSqlUpdate } from '@daita/relational/dist/sql/dml/update/sql-update';
import { isSqlInsert } from '@daita/relational/dist/sql/dml/insert/sql-insert';
import { isSqlCreateTable } from '@daita/relational/dist/sql/ddl/create-table/create-table-query';
import { isSqlDropTable } from '@daita/relational/dist/sql/ddl/drop-table/drop-table-query';
import { sqliteFormatter } from './sqlite-formatter';

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
    const ctx = new SimpleFormatContext('?');
    const query = sqliteFormatter.format(sql, ctx);
    return await this.execRaw(query, ctx.getValues());
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

  supportsQuery(sql: any): boolean {
    return isSqlDelete(sql) || isSqlSelect(sql) || isSqlUpdate(sql) || 
      isSqlInsert(sql) || isSqlCreateTable(sql) || isSqlDropTable(sql);
  }
}

export class SqliteRelationalAdapter extends SqliteRelationalDataAdapter implements RelationalTransactionAdapter {
  constructor(private fileName: string) {
    super(new sqlite.Database(fileName));
  }

  transaction<T>(action: (adapter: RelationalDataAdapter) => Promise<T>): Promise<T> {
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
  name: "@daita/sqlite-adapter",
  canCreate(connectionString: string): boolean {
    return connectionString === ":memory:" || connectionString.startsWith('.' || connectionString.startsWith('sqlite:'));
  }
};

function getFileName(options?: CreateAdapterOptions) {
  const connectionString = options?.connectionString ?? process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("missing connection string");
  }
  return connectionString;
}
