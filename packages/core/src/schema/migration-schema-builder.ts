import {AddCollectionFieldMigrationStep} from '../migration/steps/document-add-collection-field.migration-step';
import {AddCollectionMigrationStep} from '../migration/steps/document-add-collection.migration-step';
import {DropCollectionFieldMigrationStep} from '../migration/steps/document-drop-collection-field.migration-step';
import {DropCollectionMigrationStep} from '../migration/steps/document-drop-collection.migration-step';
import {ModifyCollectionFieldMigrationStep} from '../migration/steps/document-modify-collection-field.migration-step';
import {RenameCollectionFieldMigrationStep} from '../migration/steps/document-rename-collection-field.migration-step';
import {RelationalAddTableMigrationStep} from '../migration/steps/relation-add-table.migration-step';
import {RelationalAddTableFieldMigrationStep} from '../migration/steps/relational-add-table-field.migration-step';
import {RelationalDropTableMigrationStep} from '../migration/steps/relational-drop-table.migration-step';
import {MigrationSchema} from './migration-schema';
import {MigrationSchemaCollection} from './migration-schema-collection';
import {MigrationSchemaCollectionField} from './migration-schema-collection-field';
import {MigrationSchemaTable} from './migration-schema-table';
import {RelationalAddTablePrimaryKey} from "../migration/steps/relational-add-table-primary-key.migration-step";
import {RelationalAddTableForeignKey} from "../migration/steps/relational-add-table-foreign-key.migration-step";
import {MigrationDescription} from "../migration";

export function getMigrationSchema(migrationPath: MigrationDescription[]) {
  const collectionMap: {[key:string]: MigrationSchemaCollection} = {};
  const tableMap: {[key:string]: MigrationSchemaTable} = {};

  for (const migration of migrationPath) {
    for (const step of migration.steps) {
      if (step instanceof AddCollectionMigrationStep) {
        collectionMap[step.collection] = new MigrationSchemaCollection(step.collection, migration);
      } else if (step instanceof AddCollectionFieldMigrationStep) {
        collectionMap[step.collection].add(
          new MigrationSchemaCollectionField(
            step.fieldName,
            step.type,
            step.required,
            step.defaultValue,
            migration,
            step.fieldName
          )
        );
      } else if (step instanceof RenameCollectionFieldMigrationStep) {
        collectionMap[step.collection].rename(
          step.oldFieldName,
          step.newFieldName
        );
      } else if(step instanceof DropCollectionMigrationStep) {
        delete collectionMap[step.collection];
      } else if(step instanceof DropCollectionFieldMigrationStep) {
        collectionMap[step.collection].drop(step.fieldName);
      } else if(step instanceof ModifyCollectionFieldMigrationStep) {
        const field = collectionMap[step.collection].field(step.fieldName);
        if (!field) {
          throw new Error('field not found');
        }
        field.required = step.required;
        field.defaultValue = step.defaultValue;
      } else if(step instanceof RelationalAddTableMigrationStep) {
        tableMap[step.table] = new MigrationSchemaTable(step.table, migration);
      } else if(step instanceof RelationalAddTableFieldMigrationStep) {
        tableMap[step.table].add(
          new MigrationSchemaCollectionField(
            step.fieldName,
            step.type,
            step.required,
            step.defaultValue,
            migration,
            step.fieldName
          )
        )
      } else if(step instanceof RelationalDropTableMigrationStep) {
        delete tableMap[step.table];
      } else if(step instanceof RelationalAddTablePrimaryKey) {
        tableMap[step.table].primaryKeys.push(...step.fieldNames);
      } else if(step instanceof RelationalAddTableForeignKey) {
        tableMap[step.table].foreignKeys.push({
          name: step.name,
          table: step.foreignTable,
          keys: step.fieldNames,
          foreignKeys: step.foreignFieldNames,
        });
      }
    }
  }

  const migrationId = migrationPath.length > 0 ? migrationPath[migrationPath.length-1].id : null;
  return new MigrationSchema(migrationId, collectionMap, tableMap);
}


