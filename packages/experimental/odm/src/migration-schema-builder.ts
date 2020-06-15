import {MigrationSchema} from './migration-schema';
import {MigrationSchemaCollection} from './migration-schema-collection';
import {MigrationSchemaCollectionField} from './migration-schema-collection-field';
import {MigrationSchemaTable} from './migration-schema-table';
import {MigrationDescription} from '../migration';
import {TablePermission} from '../permission';

export function getMigrationSchema(migrationPath: MigrationDescription[]) {
  const collectionMap: { [key: string]: MigrationSchemaCollection } = {};
  const tableMap: { [key: string]: MigrationSchemaTable } = {};
  const permissionMap: { [key: string]: TablePermission<any>[] } = {};

  for (const migration of migrationPath) {
    for (const step of migration.steps) {
      if (step.kind === 'add_collection') {
        collectionMap[step.collection] = new MigrationSchemaCollection(
          step.collection,
          migration,
        );
      } else if (step.kind === 'add_collection_field') {
        collectionMap[step.collection].add(
          new MigrationSchemaCollectionField(
            step.fieldName,
            step.type,
            step.required,
            step.defaultValue,
            migration,
            step.fieldName,
          ),
        );
      } else if (step.kind === 'rename_collection_field') {
        collectionMap[step.collection].rename(
          step.oldFieldName,
          step.newFieldName,
        );
      } else if (step.kind === 'drop_collection') {
        delete collectionMap[step.collection];
      } else if (step.kind === 'drop_collection_field') {
        collectionMap[step.collection].drop(step.fieldName);
      } else if (step.kind === 'modify_collection_field') {
        const field = collectionMap[step.collection].field(step.fieldName);
        if (!field) {
          throw new Error('field not found');
        }
        field.required = step.required;
        field.defaultValue = step.defaultValue;
      }
    }
  }

  const migrationId =
    migrationPath.length > 0
      ? migrationPath[migrationPath.length - 1].id
      : null;
  return new MigrationSchema(migrationId, collectionMap, tableMap, permissionMap);
}