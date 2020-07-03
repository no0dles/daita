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
  for (const removedField of mergedFields.removed) {
    steps.push({ kind: 'drop_table_field', table: newTable.name, fieldName: removedField.name });
  }
  if (mergedFields.merge.length > 0) {
    // TODO throw new Error('merge not supported yet');
  }

  const mergedPrimaryKeys = merge(currentTable.primaryKeys, newTable.primaryKeys, (first, second) => first.key === second.key);

  if (mergedPrimaryKeys.added.length > 0 || mergedPrimaryKeys.removed.length > 0) {
    throw new Error(`cant change primary key for table ${currentTable.name} (${mergedPrimaryKeys.added.map(a => a.name)}/${mergedPrimaryKeys.removed.map(a => a.name)})`);
  }

  const mergedReferences = merge(currentTable.references, newTable.references, (first, second) => first.name === second.name);
  for (const addedRef of mergedReferences.added) {
    steps.push({
      kind: 'add_table_foreign_key',
      table: currentTable.name,
      name: addedRef.name,
      fieldNames: addedRef.keys.map(key => key.field.name),
      foreignFieldNames: addedRef.keys.map(key => key.foreignField.name),
      foreignTable: addedRef.table.name,
      required: addedRef.required,
    });
  }

  const mergedIndices = merge(currentTable.indices, newTable.indices, (first, second) => first.name === second.name);
  for (const addedIndex of mergedIndices.added) {
    steps.push({
      kind: 'create_index',
      table: currentTable.name,
      schema: currentTable.schema,
      unique: addedIndex.unique,
      name: addedIndex.name,
      fields: addedIndex.fields.map(f => f.name),
    });
  }
  for (const removedIndex of mergedIndices.removed) {
    steps.push({
      kind: 'drop_index',
      table: currentTable.name,
      schema: currentTable.schema,
      name: removedIndex.name,
    });
  }
  for (const mergedIndex of mergedIndices.merge) {
    throw new Error('chaning index is not supported yet');
  }

  return steps;
}
