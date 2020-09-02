import {
  RelationalAdapterImplementation,
  RelationalTransactionAdapter,
} from '../relational/adapter';
import { SqliteRelationalAdapter } from './index';
import { isKind } from '../common/utils';
import * as fs from 'fs';

export type SqliteAdapterOptions =
  | SqliteAdapterFileOptions
  | SqliteAdapterMemoryOptions;

export interface SqliteAdapterFileOptions {
  file: string;
  dropIfExists?: boolean;
}

export interface SqliteAdapterMemoryOptions {
  memory: true;
}

const isFileOptions = (val: any): val is SqliteAdapterFileOptions =>
  isKind<SqliteAdapterFileOptions>(val, ['file']);
const isMemoryOptions = (val: any): val is SqliteAdapterMemoryOptions =>
  isKind<SqliteAdapterMemoryOptions>(val, ['memory']);

export const sqliteAdapter: RelationalAdapterImplementation<
  any,
  SqliteAdapterOptions
> = {
  getAdapter(
    options?: SqliteAdapterOptions,
  ): RelationalTransactionAdapter<any> {
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
