import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { randomString } from '@daita/common';
import { SqliteSql, SqliteRelationalMigrationAdapter, adapter } from '@daita/sqlite-adapter';
import { RelationalAdapterImplementation } from '@daita/relational';

export interface SqliteTestAdapterFileOptions {
  type: 'file';
}

export interface SqliteTestAdapterMemoryOptions {
  type: 'memory';
}

export type SqliteTestAdapterOptions = SqliteTestAdapterFileOptions | SqliteTestAdapterMemoryOptions;

export class SqliteTestAdapterImplementation
  implements RelationalAdapterImplementation<SqliteRelationalMigrationAdapter, SqliteSql, SqliteTestAdapterOptions>
{
  getRelationalAdapter(options: SqliteTestAdapterOptions): SqliteRelationalMigrationAdapter {
    if (options.type === 'memory') {
      return adapter.getRelationalAdapter({ memory: true });
    } else {
      const fileName = path.join(os.tmpdir(), `${randomString(22)}.db`);
      return adapter.getRelationalAdapter({
        file: fileName,
      });
      // await fs.unlink(fileName); // TODO
    }
  }
}

export const sqliteTestAdapter = new SqliteTestAdapterImplementation();
