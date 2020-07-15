import { RelationalTransactionAdapter, RelationalTransactionAdapterPackage } from '@daita/relational';
import { RelationalTest } from './relational-test';
// import * as pg from '@daita/pg-adapter';
// import * as sqlite from '@daita/sqlite-adapter';

// export const adapters: { factory: RelationalTransactionAdapterPackage, connectionString: string }[] = [
//   { factory: pg, connectionString: 'postgres://postgres:postgres@localhost/postgres' },
//   { factory: sqlite, connectionString: './test.db' },
// ];
export const adapters: { factory: RelationalTransactionAdapterPackage, connectionString: string }[] = [];

export function testAdapter(arg: RelationalTest, fn: (adapter: RelationalTransactionAdapter) => void) {
  return () => {
    it(arg.factory.adapterFactory.name, async () => {
      const adapter = await arg.factory.adapterFactory.createTransactionAdapter({
        connectionString: arg.connectionString,
      });
      try {
        await fn(adapter);
      } finally {
        await adapter.close();
      }
    });
  };
}

export async function iterateAdapters(arg: RelationalTest, fn: (adapter: RelationalTransactionAdapter) => void) {
  const adapter = await arg.factory.adapterFactory.createTransactionAdapter({
    connectionString: arg.connectionString,
  });
  try {
    await fn(adapter);
  } finally {
    await adapter.close();
  }
}
