import * as fs from 'fs';
import { RelationalTransactionAdapterImplementation } from '@daita/relational';
import { isKind } from '@daita/common';
import { RelationalMigrationAdapterImplementation } from '@daita/orm';
import { RelationalMigrationAdapter } from '@daita/orm';
import { SqliteSql } from '../sql/sqlite-sql';
import { SqliteRelationalMigrationAdapter } from './sqlite-relational-migration-adapter';
import { Resolvable } from '@daita/common';

export type SqliteAdapterOptions = SqliteAdapterFileOptions | SqliteAdapterMemoryOptions;

export interface SqliteAdapterFileOptions {
  file: string;
  dropIfExists?: boolean;
}

export interface SqliteAdapterMemoryOptions {
  memory: true;
}

function getSqliteFilename(fileName: string) {
  if (fileName.startsWith('sqlite://')) {
    return fileName.substr('sqlite://'.length);
  } else {
    return fileName;
  }
}

const isFileOptions = (val?: SqliteAdapterOptions): val is SqliteAdapterFileOptions =>
  isKind<SqliteAdapterFileOptions>(val, ['file']);
const isMemoryOptions = (val?: SqliteAdapterOptions): val is SqliteAdapterMemoryOptions =>
  isKind<SqliteAdapterMemoryOptions>(val, ['memory']);

export class SqliteAdapterImplementation
  implements RelationalMigrationAdapterImplementation<SqliteSql, SqliteAdapterOptions>,
    RelationalTransactionAdapterImplementation<SqliteSql, SqliteAdapterOptions> {
  getRelationalAdapter(options: SqliteAdapterOptions): RelationalMigrationAdapter<SqliteSql> {
    if (isFileOptions(options)) {
      const fileName = getSqliteFilename(options.file);
      if (options.dropIfExists && fileName !== ':memory:') {
        if (fs.existsSync(fileName)) {
          fs.unlinkSync(fileName);
        }
      }
      return new SqliteRelationalMigrationAdapter(new Resolvable<string>(fileName));
    }
    if (isMemoryOptions(options) && options.memory) {
      return new SqliteRelationalMigrationAdapter(new Resolvable<string>(':memory:'));
    }

    return new SqliteRelationalMigrationAdapter(new Resolvable<string>(':memory:'));
  }
}
