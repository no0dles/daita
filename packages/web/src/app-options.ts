import {
  MigrationTree,
  RelationalDataAdapter,
  RelationalSchema,
} from '@daita/core';

export interface BaseAppOptions {
  transactionTimeout?: number;
}

export interface AppSchemaOptions extends BaseAppOptions {
  dataAdapter: RelationalDataAdapter;
  schema: RelationalSchema;
}
export interface AppMigrationTreeOptions extends BaseAppOptions {
  dataAdapter: RelationalDataAdapter;
  migrationTree: MigrationTree;
}

export type AppOptions = AppSchemaOptions | AppMigrationTreeOptions;
