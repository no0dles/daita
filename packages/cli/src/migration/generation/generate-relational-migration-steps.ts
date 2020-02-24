import {MigrationStep, RelationalTableSchema} from '@daita/core';
import {generateRelationalTableMigrationSteps} from './generate-relational-table-migration-steps';
import {mergeList} from '../utils';

export function generateRelationalMigrationSteps(
  currentSchema: RelationalTableSchema,
  newSchema: RelationalTableSchema,
) {
  const steps: MigrationStep[] = [];

  mergeList(currentSchema.tables, newSchema.tables, {
    compare: (first, second) => first.name === second.name,
    add: table => {
      steps.push({kind: 'add_table', table: table.name});
      for (const field of table.fields) {
        steps.push({
          kind: 'add_table_field',
          table: table.name,
          fieldName: field.name,
          type: field.type,
          required: field.required,
          defaultValue: field.defaultValue,
        });
      }

      steps.push(
        {kind: 'add_table_primary_key', table: table.name, fieldNames: table.primaryKeys},
      );
      for (const foreignKey of table.foreignKeys) {
        steps.push({
          kind: 'add_table_foreign_key',
          table: table.name,
          name: foreignKey.name,
          fieldNames: foreignKey.keys,
          foreignFieldNames: foreignKey.foreignKeys,
          foreignTable: foreignKey.table,
          required: foreignKey.required,
        });
      }
    },
    remove: table => {
      steps.push({kind: 'drop_table', table: table.name});
    },
    merge: (currentTable, newTable) => {
      steps.push(...generateRelationalTableMigrationSteps(currentTable, newTable));
    },
  });

  return steps;
}