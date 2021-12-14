import { DefaultConstructable, ExcludeNonPrimitive } from '@daita/common';
import {
  getContext,
  MigrationContext,
  MigrationContextOptions,
  RelationalMigrationAdapterImplementation,
} from '@daita/orm';
import { table } from '@daita/relational';

export interface TestContext {
  seed<T>(table: DefaultConstructable<T>, value: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[]): TestContext;

  addAdapter<TQuery, TOptions>(
    adapterImplementation: RelationalMigrationAdapterImplementation<TQuery, TOptions>,
    options: MigrationContextOptions & TOptions,
  ): TestContext;

  contexts(): TextContext<any>[];
}

export interface TextContext<T> extends MigrationContext<T> {
  setup(): Promise<void>;
}

export function getTestContext(): TestContext {
  const seeds: { table: DefaultConstructable<any>; value: any | any[] }[] = [];
  const adapterConfigs: {
    adapterImplementation: RelationalMigrationAdapterImplementation<any, any>;
    options: MigrationContextOptions;
  }[] = [];
  return {
    seed<T>(table: DefaultConstructable<T>, value: T[] | T): TestContext {
      seeds.push({ table, value });
      return this;
    },
    contexts(): TextContext<any>[] {
      return adapterConfigs.map((config) => {
        const ctx = getContext(config.adapterImplementation, config.options) as TextContext<any>;
        ctx.setup = async () => {
          await ctx.remove();
          await ctx.migrate();
          for (const seed of seeds) {
            await ctx.insert({
              insert: seed.value,
              into: table(seed.table),
            });
          }
        };
        return ctx;
      });
    },
    addAdapter<TQuery, TOptions>(
      adapterImplementation: RelationalMigrationAdapterImplementation<TQuery, TOptions>,
      options: MigrationContextOptions & TOptions,
    ): TestContext {
      adapterConfigs.push({ adapterImplementation, options });
      return this;
    },
  };
}
