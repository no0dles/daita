import {
  DefaultConstructable,
  RelationalDataAdapter, RelationalMigrationAdapter, RelationalSchema,
  RelationalTransactionAdapter,
} from '@daita/core';
import {PostgresAdapter} from '@daita/pg';

export const userA = {
  id: 'a',
  name: 'foo',
  count: 2,
  admin: true,
  parentId: null,
};
export const userB = {
  id: 'b',
  name: 'bar',
  count: 14,
  admin: false,
  parentId: 'a',
};

export function getTestAdapter() {
  return adapters[0].adapter;
}

export function seed(dataAdapter: RelationalDataAdapter, schema: RelationalSchema): SeedBuilder {
  return new SeedBuilder(dataAdapter, schema);
}

export async function migrate(dataAdapter: RelationalMigrationAdapter, schema: RelationalSchema) {
  const context = schema.migrationContext(dataAdapter);
  await context.apply();
}

export class SeedBuilder implements Promise<void> {
  private promises: Promise<any>[] = [];

  [Symbol.toStringTag]: 'Promise';

  constructor(private dataAdapter: RelationalDataAdapter,
              private schema: RelationalSchema) {
  }

  clear<T>(type: DefaultConstructable<T>): SeedBuilder {
    this.promises.push(this.schema.context(this.dataAdapter).delete(type));
    return this;
  }

  table<T>(type: DefaultConstructable<T>, rows: T[]): SeedBuilder {
    this.promises.push(this.schema.context(this.dataAdapter).insert(type).values(...rows));
    return this;
  }

  private async execute() {
    for (const promise of this.promises) {
      await promise;
    }
  }

  catch<TResult = never>(onrejected?: ((reason: any) => (PromiseLike<TResult> | TResult)) | undefined | null): Promise<void | TResult> {
    return this.execute().catch(onrejected);
  }

  then<TResult1 = void, TResult2 = never>(onfulfilled?: ((value: void) => (PromiseLike<TResult1> | TResult1)) | undefined | null, onrejected?: ((reason: any) => (PromiseLike<TResult2> | TResult2)) | undefined | null): Promise<TResult1 | TResult2> {
    return this.execute().then(onfulfilled, onrejected);
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<void> {
    return this.execute().finally(onfinally);
  }
}


const adapters: { adapter: RelationalTransactionAdapter, name: string }[] = [
  {name: 'postgres', adapter: new PostgresAdapter('postgres://postgres:postgres@localhost:5432/test')},
];
