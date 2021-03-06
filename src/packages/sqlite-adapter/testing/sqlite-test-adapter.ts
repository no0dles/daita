import { RelationalTransactionAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { SqliteSql } from '../sql/sqlite-sql';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import path from 'path';
import os from 'os';
import { promises as fs } from 'fs';
import { adapter } from '../index';
import { randomString } from '../../common/utils/random-string';
import { SqliteRelationalMigrationAdapter } from '../adapter/sqlite-relational-migration-adapter';
import { Resolvable } from '../../common/utils/resolvable';

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
    RelationalMigrationAdapterImplementation<SqliteSql, SqliteTestAdapterOptions> {
  getRelationalAdapter(options: SqliteTestAdapterOptions): RelationalMigrationAdapter<SqliteSql> {
    if (options.type === 'memory') {
      return adapter.getRelationalAdapter({ memory: true });
    } else {
      const fileName = path.join(os.tmpdir(), `${randomString(22)}.db`);
      return new SqliteRelationalMigrationAdapter(
        new Resolvable<string>(fileName, async () => {
          await fs.unlink(fileName);
        }),
      );
    }
  }
}
