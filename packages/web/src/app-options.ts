import {MigrationTree, RelationalDataAdapter, RelationalSchema} from '@daita/core';

export interface AppSchemaOptions  { dataAdapter: RelationalDataAdapter, schema: RelationalSchema }
export interface AppMigrationTreeOptions { dataAdapter: RelationalDataAdapter,  migrationTree: MigrationTree }

export type AppOptions = AppSchemaOptions | AppMigrationTreeOptions;