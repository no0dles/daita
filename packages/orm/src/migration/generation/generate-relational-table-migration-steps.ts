import { merge } from '@daita/common';
import { RelationalTableDescription } from '../../schema/description/relational-table-description';
import { MigrationStep } from '../migration-step';

export function generateRelationalTableMigrationSteps(
  currentTable: RelationalTableDescription,
  newTable: RelationalTableDescription,
) {
  const steps: MigrationStep[] = [];

  const mergedFields = merge(currentTable.fields, newTable.fields, (first, second) => first.name === second.name);
  for (const addedField of mergedFields.added) {
    steps.push({
      kind: 'add_table_field',
      fieldName: addedField.name,
      type: addedField.type,
      required: addedField.required,
      defaultValue: addedField.defaultValue,
      table: newTable.name,
    });
  }
  for (const removedField of mergedFields.added) {
    steps.push({ kind: 'drop_table_field', table: newTable.name, fieldName: removedField.name });
  }
  if (mergedFields.merge.length > 0) {
    // TODO throw new Error('merge not supported yet');
  }

  const mergedPrimaryKeys = merge(currentTable.primaryKeys, newTable.primaryKeys, (first, second) => first === second);

  if (mergedPrimaryKeys.added.length > 0 || mergedPrimaryKeys.removed.length > 0) {
    throw new Error(`cant change primary key for table ${currentTable.name}`);
  }

  // mergeList(currentTable.foreignKeys, newTable.foreignKeys, {
  //   compare: (first, second) => first.table === second.table,
  // });

  return steps;
}
