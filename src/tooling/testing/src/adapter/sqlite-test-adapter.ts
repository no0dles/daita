import { RelationalTransactionAdapterImplementation } from '@daita/relational';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { randomString } from '@daita/common';
import { SqliteSql, SqliteRelationalMigrationAdapter, adapter } from '@daita/sqlite-adapter';

export interface SqliteTestAdapterFileOptions {
  type: 'file';
}

export interface SqliteTestAdapterMemoryOptions {
  type: 'memory';
}

export type SqliteTestAdapterOptions = SqliteTestAdapterFileOptions | SqliteTestAdapterMemoryOptions;

export class SqliteTestAdapterImplementation
  implements
    RelationalTransactionAdapterImplementation<SqliteSql, SqliteTestAdapterOptions>,
    RelationalMigrationAdapterImplementation<SqliteSql, SqliteTestAdapterOptions>
{
  getRelationalAdapter(options: SqliteTestAdapterOptions): RelationalMigrationAdapter<SqliteSql> {
    if (options.type === 'memory') {
      return adapter.getRelationalAdapter({ memory: true });
    } else {
      const fileName = path.join(os.tmpdir(), `${randomString(22)}.db`);
      return new SqliteRelationalMigrationAdapter(fileName);

      // await fs.unlink(fileName); // TODO
    }
  }
}

export const sqliteTestAdapter = new SqliteTestAdapterImplementation();
