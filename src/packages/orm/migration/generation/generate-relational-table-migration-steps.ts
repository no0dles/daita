import { RelationalTableDescription } from '../../schema/description/relational-table-description';
import { MigrationStep } from '../migration-step';
import { merge } from '../../../common/utils/merge';

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
      schema: currentTable.schema,
    });
  }
  for (const removedField of mergedFields.removed) {
    steps.push({
      kind: 'drop_table_field',
      table: newTable.name,
      fieldName: removedField.name,
    });
  }
  if (mergedFields.merge.length > 0) {
    // TODO throw new Error('merge not supported yet');
  }

  const mergedPrimaryKeys = merge(
    currentTable.primaryKeys,
    newTable.primaryKeys,
    (first, second) => first.key === second.key,
  );

  if (mergedPrimaryKeys.added.length > 0 || mergedPrimaryKeys.removed.length > 0) {
    steps.push({
      kind: 'drop_table_primary_key',
      schema: newTable.schema,
      table: newTable.name,
    });
    steps.push({
      kind: 'add_table_primary_key',
      fieldNames: newTable.primaryKeys.map((k) => k.name),
      schema: newTable.schema,
      table: newTable.name,
    });
  }

  const mergedReferences = merge(
    currentTable.references,
    newTable.references,
    (first, second) => first.name === second.name,
  );
  for (const addedRef of mergedReferences.added) {
    steps.push({
      kind: 'add_table_foreign_key',
      table: currentTable.name,
      schema: currentTable.schema,
      name: addedRef.name,
      fieldNames: addedRef.keys.map((key) => key.field.name),
      foreignFieldNames: addedRef.keys.map((key) => key.foreignField.name),
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
      fields: addedIndex.fields.map((f) => f.name),
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

  const mergedSeeds = merge(currentTable.seeds, newTable.seeds, (first, second) => first.key === second.key);
  for (const addedSeed of mergedSeeds.added) {
    steps.push({
      kind: 'insert_seed',
      seed: addedSeed.seed,
      keys: addedSeed.seedKeys,
      table: currentTable.name,
      schema: currentTable.schema,
    });
  }

  for (const mergedSeed of mergedSeeds.merge) {
    if (
      JSON.stringify(mergedSeed.current.seed) === JSON.stringify(mergedSeed.target.seed) //TODO does not work for regex
    ) {
      continue;
    }

    steps.push({
      kind: 'update_seed',
      keys: mergedSeed.target.seedKeys,
      seed: mergedSeed.target.seed,
      table: currentTable.name,
      schema: currentTable.schema,
    });
  }

  for (const deletedSeeds of mergedSeeds.removed) {
    steps.push({
      kind: 'delete_seed',
      keys: deletedSeeds.seedKeys,
      table: currentTable.name,
      schema: currentTable.schema,
    });
  }

  return steps;
}
