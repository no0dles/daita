import { Constructable } from '@daita/common';
import { iterateAdapters } from './adapters';
import { table } from '@daita/relational';
import { RelationalTest } from './relational-test';

export async function seed<T>(arg: RelationalTest, type: Constructable<T>, columns: any[], items: T[]) {
  await iterateAdapters(arg, async adapter => {
    await adapter.exec({
      dropTable: table(type),
      ifExists: true,
    });
    await adapter.exec({
      createTable: table(type),
      columns: columns,
    });
    await adapter.exec({
      insert: items,
      into: table(type),
    });
  });
}
