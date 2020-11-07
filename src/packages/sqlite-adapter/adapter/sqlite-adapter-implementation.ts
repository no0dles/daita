import * as fs from 'fs';
import { RelationalTransactionAdapter } from '../../relational/adapter/relational-transaction-adapter';
import { RelationalAdapterImplementation } from '../../relational/adapter/relational-adapter-implementation';
import { isKind } from '../../common/utils/is-kind';
import { SqliteRelationalAdapter } from './sqlite-relational-adapter';

export type SqliteAdapterOptions = SqliteAdapterFileOptions | SqliteAdapterMemoryOptions;

export interface SqliteAdapterFileOptions {
  file: string;
  dropIfExists?: boolean;
}

export interface SqliteAdapterMemoryOptions {
  memory: true;
}

const isFileOptions = (val: any): val is SqliteAdapterFileOptions => isKind<SqliteAdapterFileOptions>(val, ['file']);
const isMemoryOptions = (val: any): val is SqliteAdapterMemoryOptions =>
  isKind<SqliteAdapterMemoryOptions>(val, ['memory']);

export const sqliteAdapter: RelationalAdapterImplementation<any, SqliteAdapterOptions> = {
  getRelationalAdapter(options?: SqliteAdapterOptions): RelationalTransactionAdapter<any> {
    if (isFileOptions(options)) {
      if (options.dropIfExists) {
        if (fs.existsSync(options.file)) {
          fs.unlinkSync(options.file);
        }
      }
      return new SqliteRelationalAdapter(options.file);
    }
    if (isMemoryOptions(options) && options.memory) {
      return new SqliteRelationalAdapter(':memory:');
    }
    if (process.env.DATABASE_URL) {
      return new SqliteRelationalAdapter(process.env.DATABASE_URL);
    }

    return new SqliteRelationalAdapter(':memory:');
  },
};
