import {MigrationSchema} from './migration-schema';
import {MigrationSchemaCollection} from './migration-schema-collection';
import {MigrationSchemaCollectionField} from './migration-schema-collection-field';
import {MigrationSchemaTable} from './migration-schema-table';
import {MigrationDescription} from '../migration';
import {Permission} from '../permission';
import {MigrationSchemaTableField} from './migration-schema-table-field';

export function getMigrationSchema(migrationPath: MigrationDescription[]) {
  const collectionMap: { [key: string]: MigrationSchemaCollection } = {};
  const tableMap: { [key: string]: MigrationSchemaTable } = {};
  const permissionMap: { [key: string]: Permission<any>[] } = {};

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
      } else if (step.kind === 'add_table') {
        tableMap[step.table] = new MigrationSchemaTable(step.table, migration);
      } else if (step.kind === 'add_table_field') {
        tableMap[step.table].add(
          new MigrationSchemaTableField(
            step.fieldName,
            step.type,
            step.required || false,
            step.defaultValue,
            migration,
            step.fieldName,
          ),
        );
      } else if (step.kind === 'drop_table') {
        delete tableMap[step.table];
      } else if (step.kind === 'add_table_primary_key') {
        tableMap[step.table].primaryKeys.push(...step.fieldNames);
      } else if (step.kind === 'add_table_foreign_key') {
        tableMap[step.table].foreignKeys.push({
          name: step.name,
          table: step.foreignTable,
          keys: step.fieldNames,
          foreignKeys: step.foreignFieldNames,
          required: step.required,
        });
      } else if (step.kind === 'add_table_permission') {
        if (!permissionMap[step.table]) {
          permissionMap[step.table] = [];
        }
        permissionMap[step.table].push(step.permission);
      } else if (step.kind === 'drop_table_permission') {
        const permissions = permissionMap[step.table];
        for (let i = 0; permissions.length; i++) {
          if (JSON.stringify(permissions[i]) === JSON.stringify(step.permission)) {
            permissions.splice(i, 1);
            break;
          }
        }
      } else if (step.kind === 'drop_table_field') {
        tableMap[step.table].drop(step.fieldName);
      } else {
        fail(step, `Unknown migration step ${step}`);
      }
    }
  }

  const migrationId =
    migrationPath.length > 0
      ? migrationPath[migrationPath.length - 1].id
      : null;
  return new MigrationSchema(migrationId, collectionMap, tableMap, permissionMap);
}

function fail(value: never, message: string): never {
  throw new Error(message);
}
