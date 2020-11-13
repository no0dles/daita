import * as fs from 'fs';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalTransactionAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { isKind } from '../../common/utils/is-kind';
import { SqliteAdapter, SqliteRelationalAdapter } from './sqlite-relational-adapter';
import { RelationalDataAdapter } from '../../relational';
import { RelationalMigrationAdapter } from '../../orm/adapter/relational-migration-adapter';
import { RelationalMigrationAdapterImplementation } from '../../orm/adapter/relational-migration-adapter-implementation';

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

export const sqliteAdapter: RelationalTransactionAdapterImplementation<any, SqliteAdapterOptions> &
  RelationalMigrationAdapterImplementation<any, SqliteAdapterOptions> = {
  getRelationalAdapter(
    options: SqliteAdapterOptions,
  ): RelationalTransactionAdapter<any> & RelationalDataAdapter<any> & RelationalMigrationAdapter<any> {
    if (isFileOptions(options)) {
      const fileName = getSqliteFilename(options.file);
      if (options.dropIfExists && fileName !== ':memory:') {
        if (fs.existsSync(fileName)) {
          fs.unlinkSync(fileName);
        }
      }
      return new SqliteAdapter(fileName);
    }
    if (isMemoryOptions(options) && options.memory) {
      return new SqliteAdapter(':memory:');
    }

    return new SqliteAdapter(':memory:');
  },
};
