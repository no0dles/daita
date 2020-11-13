import { DataAdapterTestFactory } from './data-adapter-test-factory';
import { ClientTestFactory } from './client-test-factory';
import { TransactionAdapterTestFactory } from './transaction-adapter-test-factory';
import { TransactionClientTestFactory } from './transaction-client-test-factory';
import { TransactionClientTestContext } from './transaction-client-test-context';
import { randomString } from '../../../packages/common';
import path from 'path';
import fs from 'fs/promises';
import { SqliteFileTestContext } from './sqlite-file-test-context';
import { adapter as sqliteAdapter } from '../../../packages/sqlite-adapter';
import { TransactionAdapterTestContext } from './transaction-adapter-test-context';

export class SqliteFileTestFactory
  implements DataAdapterTestFactory, ClientTestFactory, TransactionAdapterTestFactory, TransactionClientTestFactory {
  name = 'sqlite-adapter-file';

  async getContext(): Promise<TransactionClientTestContext> {
    const fileName = `./dist/tmp/${randomString()}.db`;
    const dirName = path.dirname(fileName);
    try {
      await fs.access(dirName);
    } catch (e) {
      await fs.mkdir(dirName);
    }
    return new SqliteFileTestContext(fileName, sqliteAdapter.getRelationalAdapter({ file: `sqlite://${fileName}` }));
  }

  toString() {
    return 'sqlite-file';
  }

  getClient(): Promise<TransactionClientTestContext> {
    return this.getContext();
  }

  getAdapter(): Promise<TransactionAdapterTestContext> {
    return this.getContext();
  }
}
