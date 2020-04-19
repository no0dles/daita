// import {PostgresAdapter} from './postgres.adapter';
// import {dropDatabase} from './postgres.util';
// import {RelationalSchema} from '@daita/core';
// import {RelationalDataAdapterFactory} from '@daita/core/dist/test/test-utils';
//
// export class PostgresDataAdapterFactory implements RelationalDataAdapterFactory<PostgresAdapter> {
//   constructor(private name: string) {
//   }
//   async create(schema: RelationalSchema) {
//     const connectionString = (process.env.POSTGRES_URI || 'postgres://postgres:postgres@localhost') + `/${this.name}`;
//     await dropDatabase(connectionString);
//
//     const dataAdapter = new PostgresAdapter(connectionString);
//     const context = schema.migrationContext(dataAdapter);
//     await context.apply();
//     return {
//       close: async() => {
//         await dataAdapter.close();
//         await dropDatabase(connectionString);
//       },
//       dataAdapter,
//     }
//   }
// }
