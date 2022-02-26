import { MigrationStep } from '../migration-step';
import { merge, mergeArray } from '@daita/common';
import {
  getFieldNamesFromSchemaTable,
  getTableFromSchema,
  SchemaDescription,
  SchemaTableDescription,
} from '../../schema/description/relational-schema-description';
import { isTableReferenceRequiredInTable } from '../../schema/description/relational-table-reference-description';
import { table } from '@daita/relational';

export function generateRelationalTableMigrationSteps(
  newSchema: SchemaDescription,
  currentTable: SchemaTableDescription,
  newTable: SchemaTableDescription,
) {
  const steps: MigrationStep[] = [];

  const mergedFields = merge(currentTable.fields, newTable.fields);

  for (const addedField of mergedFields.added) {
    steps.push({
      kind: 'add_table_field',
      fieldName: addedField.item.name,
      type: addedField.item.type,
      required: addedField.item.required,
      defaultValue: addedField.item.defaultValue,
      table: newTable.name,
      schema: currentTable.schema,
    });
  }
  for (const removedField of mergedFields.removed) {
    steps.push({
      kind: 'drop_table_field',
      table: newTable.name,
      fieldName: removedField.item.name,
      schema: currentTable.schema,
    });
  }
  if (mergedFields.merge.length > 0) {
    // TODO throw new Error('merge not supported yet');
  }

  const mergedPrimaryKeys = mergeArray(currentTable.primaryKeys, newTable.primaryKeys);

  if (mergedPrimaryKeys.added.length > 0 || mergedPrimaryKeys.removed.length > 0) {
    steps.push({
      kind: 'drop_table_primary_key',
      schema: newTable.schema,
      table: newTable.name,
    });
    steps.push({
      kind: 'add_table_primary_key',
      fieldNames: getFieldNamesFromSchemaTable(newTable, newTable.primaryKeys || []),
      schema: newTable.schema,
      table: newTable.name,
    });
  }

  const mergedReferences = merge(currentTable.references, newTable.references);
  for (const addedRef of mergedReferences.added) {
    const foreignTable = getTableFromSchema(newSchema, table(addedRef.item.table, addedRef.item.schema));
    steps.push({
      kind: 'add_table_foreign_key',
      table: currentTable.name,
      schema: currentTable.schema,
      name: addedRef.item.name,
      fieldNames: getFieldNamesFromSchemaTable(
        newTable,
        addedRef.item.keys.map((k) => k.field),
      ),
      foreignFieldNames: getFieldNamesFromSchemaTable(
        foreignTable.table,
        addedRef.item.keys.map((k) => k.foreignField),
      ),
      foreignTable: foreignTable.table.name,
      foreignTableSchema: foreignTable.table.schema,
      required: isTableReferenceRequiredInTable(newTable, addedRef.item),
    });
  }

  for (const mergedRef of mergedReferences.merge) {
    const foreignTable = getTableFromSchema(newSchema, table(mergedRef.target.table, mergedRef.target.schema));
    steps.push({
      kind: 'add_table_foreign_key',
      table: currentTable.name,
      schema: currentTable.schema,
      onUpdate: mergedRef.target.onUpdate ?? undefined,
      onDelete: mergedRef.target.onDelete ?? undefined,
      name: mergedRef.target.name,
      foreignTable: mergedRef.target.name,
      foreignTableSchema: mergedRef.target.schema,
      fieldNames: getFieldNamesFromSchemaTable(
        newTable,
        mergedRef.target.keys.map((k) => k.field),
      ),
      foreignFieldNames: getFieldNamesFromSchemaTable(
        foreignTable.table,
        mergedRef.target.keys.map((k) => k.foreignField),
      ),
      required: isTableReferenceRequiredInTable(newTable, mergedRef.target),
    });
  }

  const mergedIndices = merge(currentTable.indices, newTable.indices);
  for (const addedIndex of mergedIndices.added) {
    steps.push({
      kind: 'create_index',
      table: currentTable.name,
      schema: currentTable.schema,
      unique: addedIndex.item.unique,
      name: addedIndex.item.name,
      fields: getFieldNamesFromSchemaTable(newTable, addedIndex.item.fields),
    });
  }
  for (const removedIndex of mergedIndices.removed) {
    steps.push({
      kind: 'drop_index',
      table: currentTable.name,
      schema: currentTable.schema,
      name: removedIndex.item.name,
    });
  }
  for (const mergedIndex of mergedIndices.merge) {
    steps.push({
      kind: 'drop_index',
      table: currentTable.name,
      schema: currentTable.schema,
      name: mergedIndex.current.name,
    });
    steps.push({
      kind: 'create_index',
      table: currentTable.name,
      schema: currentTable.schema,
      unique: mergedIndex.target.unique,
      name: mergedIndex.target.name,
      fields: getFieldNamesFromSchemaTable(newTable, mergedIndex.target.fields),
    });
  }

  const mergedSeeds = merge(currentTable.seeds, newTable.seeds);
  for (const addedSeed of mergedSeeds.added) {
    steps.push({
      kind: 'insert_seed',
      seed: addedSeed.item.seed,
      keys: addedSeed.item.seedKeys,
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
      keys: deletedSeeds.item.seedKeys,
      table: currentTable.name,
      schema: currentTable.schema,
    });
  }

  return steps;
}
