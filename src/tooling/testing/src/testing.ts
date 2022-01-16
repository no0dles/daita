import { DefaultConstructable, ExcludeNonPrimitive } from '@daita/common';
import { MigrationContext } from '@daita/orm';
import { RelationalAdapter, RelationalAdapterImplementation, table } from '@daita/relational';

// export interface TestContext {
//   seed<T>(table: DefaultConstructable<T>, value: ExcludeNonPrimitive<T> | ExcludeNonPrimitive<T>[]): TestContext;
//
//   addAdapter<TAdapter extends RelationalAdapter<TQuery>, TQuery, TOptions>(
//     adapterImplementation: RelationalAdapterImplementation<TAdapter, TQuery, TOptions>,
//     options: TOptions,
//   ): TestContext;
//
//   contexts(sql?: any): TextContext<any>[];
// }
//
// export interface TestContextSetup {
//   remove: boolean;
//   migrate: boolean;
//   seed: boolean;
// }
//
// export interface TextContext<T> extends MigrationContext<T> {
//   setup(options?: Partial<TestContextSetup>): Promise<void>;
// }
//
// export function getTestContext(): TestContext {
//   const seeds: { table: DefaultConstructable<any>; value: any | any[] }[] = [];
//   const adapterConfigs: {
//     adapterImplementation: RelationalMigrationAdapterImplementation<any, any>;
//     options: MigrationContextOptions;
//   }[] = [];
//   return {
//     seed<T>(table: DefaultConstructable<T>, value: T[] | T): TestContext {
//       seeds.push({ table, value });
//       return this;
//     },
//     contexts(sql?: any): TextContext<any>[] {
//       return adapterConfigs
//         .map((config) => {
//           const ctx = getContext(config.adapterImplementation, config.options) as TextContext<any>;
//           ctx.setup = async (options?: Partial<TestContextSetup>) => {
//             if (!options || options.remove === undefined || options.remove) {
//               await ctx.remove();
//             }
//             if (!options || options.migrate === undefined || options.migrate) {
//               await ctx.migrate();
//             }
//             if (!options || options.seed === undefined || options.seed) {
//               for (const seed of seeds) {
//                 await ctx.insert({
//                   insert: seed.value,
//                   into: table(seed.table),
//                 });
//               }
//             }
//           };
//           return ctx;
//         })
//         .filter((ctx) => {
//           if (sql) {
//             return ctx.supportsQuery(sql);
//           } else {
//             return true;
//           }
//         });
//     },
//     addAdapter<TQuery, TOptions>(
//       adapterImplementation: RelationalMigrationAdapterImplementation<TQuery, TOptions>,
//       options: MigrationContextOptions & TOptions,
//     ): TestContext {
//       adapterConfigs.push({ adapterImplementation, options });
//       return this;
//     },
//   };
// }
