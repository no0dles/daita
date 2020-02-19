import { DatabaseSchema } from './database-schema';
import { MigrationSchemaCollection } from './migration-schema-collection';
import { MigrationSchemaTable } from './migration-schema-table';
import {Permission} from '../permission';

export class MigrationSchema extends DatabaseSchema<
  MigrationSchemaCollection,
  MigrationSchemaTable
> {
  constructor(
    public migrationId: string | null,
    collectionMap: { [key: string]: MigrationSchemaCollection } = {},
    tableMap: { [key: string]: MigrationSchemaTable } = {},
    permissionMap: {[key:string]: Permission<any>[]} = {},
  ) {
    super(collectionMap, tableMap, permissionMap);
  }
}
