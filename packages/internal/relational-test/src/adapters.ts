import { RelationalTransactionAdapter, RelationalTransactionAdapterPackage } from '@daita/relational';
import * as pg from '@daita/pg-adapter';
import * as sqlite from '@daita/sqlite-adapter';

export const adapters: { factory: RelationalTransactionAdapterPackage, connectionString: string }[] = [
  { factory: pg, connectionString: 'postgres://postgres:postgres@localhost/postgres' },
  { factory: sqlite, connectionString: './test.db' },
];

export function testAdapter(fn: (adapter: RelationalTransactionAdapter) => void) {
  return () => {
    for (const adapterFactory of adapters) {
      it(adapterFactory.factory.adapterFactory.name, async () => {
        const adapter = await adapterFactory.factory.adapterFactory.createTransactionAdapter({
          connectionString: adapterFactory.connectionString,
        });
        await fn(adapter);
      });
    }
  };
}

export async function iterateAdapters(fn: (adapter: RelationalTransactionAdapter) => void) {
  for (const adapterFactory of adapters) {
    const adapter = await adapterFactory.factory.adapterFactory.createTransactionAdapter({
      connectionString: adapterFactory.connectionString,
    });
    await fn(adapter);
  }
}
