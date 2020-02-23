import {MigrationStep, RelationalTableSchemaTable} from '@daita/core';
import {merge, mergeList} from '../utils';

export function generateRelationalTableMigrationSteps(
  currentTable: RelationalTableSchemaTable,
  newTable: RelationalTableSchemaTable,
) {
  const steps: MigrationStep[] = [];

  mergeList(currentTable.fields, newTable.fields, {
    compare: (first, second) => first.name === second.name,
    add: field => {
      steps.push({
        kind: 'add_table_field',
        fieldName: field.name,
        type: field.type,
        required: field.required,
        defaultValue: field.defaultValue,
        table: newTable.name,
      });
    },
    remove: field => {
      steps.push({kind: 'drop_table_field', table: newTable.name, fieldName: field.name});
    },
    merge: (currentField, newField) => {
      // TODO throw new Error('merge not supported yet');
    },
  });

  merge(currentTable.primaryKeys, newTable.primaryKeys, {
    add: key => {
      throw new Error(`cant change primary key for table ${currentTable.name}`);
    },
    remove: key => {
      throw new Error(`cant change primary key for table ${currentTable.name}`);
    },
  });

  // mergeList(currentTable.foreignKeys, newTable.foreignKeys, {
  //   compare: (first, second) => first.table === second.table,
  // });

  return steps;
}