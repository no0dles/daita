import {
  getFieldNamesFromSchemaTable,
  getFieldsFromSchemaTable,
  getIndicesFromSchemaTable,
  getReferencesFromSchemaTable,
  getSeedsFromSchemaTable,
  getTableFromSchema,
  getTablesFromSchema,
  SchemaDescription,
} from '../../schema/description/relational-schema-description';
import { MigrationStep } from '../migration-step';
import { generateRelationalTableMigrationSteps } from './generate-relational-table-migration-steps';
import { merge } from '@daita/common';
import { table } from '@daita/relational';
import { isTableReferenceRequiredInTable } from '../../schema/description/relational-table-reference-description';

export function generateRelationalMigrationSteps(currentSchema: SchemaDescription, newSchema: SchemaDescription) {
  const steps: MigrationStep[] = [];

  const mergedTables = merge(currentSchema.tables, newSchema.tables);
  const mergedViews = merge(currentSchema.views, newSchema.views);
  const mergedRules = merge(currentSchema.rules, newSchema.rules);

  for (const table of mergedTables.added) {
    steps.push({ kind: 'add_table', table: table.item.name, schema: table.item.schema });
    for (const { field } of getFieldsFromSchemaTable(table.item)) {
      steps.push({
        kind: 'add_table_field',
        table: table.item.name,
        schema: table.item.schema,
        fieldName: field.name,
        type: field.type,
        required: field.required,
        defaultValue: field.defaultValue,
      });
    }

    if (table.item.primaryKeys && table.item.primaryKeys.length > 0) {
      steps.push({
        kind: 'add_table_primary_key',
        table: table.item.name,
        schema: table.item.schema,
        fieldNames: getFieldNamesFromSchemaTable(table.item, table.item.primaryKeys),
      });
    }

    for (const index of getIndicesFromSchemaTable(table.item)) {
      steps.push({
        kind: 'create_index',
        table: table.item.name,
        schema: table.item.schema,
        unique: index.unique,
        name: index.name,
        fields: getFieldNamesFromSchemaTable(table.item, index.fields),
      });
    }

    for (const seed of getSeedsFromSchemaTable(table.item)) {
      steps.push({
        kind: 'insert_seed',
        table: table.item.name,
        schema: table.item.schema,
        keys: seed.seedKeys,
        seed: seed.seed,
      });
    }
  }

  for (const merge of mergedTables.merge) {
    steps.push(...generateRelationalTableMigrationSteps(newSchema, merge.current, merge.target));
  }

  for (const view of mergedViews.removed) {
    steps.push({ kind: 'drop_view', schema: view.item.schema, view: view.item.name });
  }

  for (const table of getTablesFromSchema(currentSchema)) {
    for (const reference of getReferencesFromSchemaTable(table)) {
      if (mergedTables.removed.some((t) => t.key === reference.table)) {
        steps.push({
          kind: 'drop_table_foreign_key',
          table: table.name,
          schema: table.schema,
          name: reference.name,
        });
      }
    }
  }

  for (const table of mergedTables.removed) {
    steps.push({ kind: 'drop_table', table: table.item.name, schema: table.item.schema });
  }

  for (const addedTable of mergedTables.added) {
    for (const foreignKey of getReferencesFromSchemaTable(addedTable.item)) {
      const foreignTable = getTableFromSchema(newSchema, table(foreignKey.table, foreignKey.schema));
      steps.push({
        kind: 'add_table_foreign_key',
        table: addedTable.item.name,
        schema: addedTable.item.schema,
        name: foreignKey.name,
        fieldNames: getFieldNamesFromSchemaTable(
          addedTable.item,
          foreignKey.keys.map((k) => k.field),
        ),
        foreignFieldNames: getFieldNamesFromSchemaTable(
          foreignTable.table,
          foreignKey.keys.map((k) => k.foreignField),
        ),
        foreignTable: foreignKey.table,
        foreignTableSchema: foreignKey.schema,
        required: isTableReferenceRequiredInTable(addedTable.item, foreignKey),
      });
    }
  }

  for (const view of mergedViews.merge) {
    steps.push({
      kind: 'alter_view',
      view: view.current.name,
      schema: view.current.schema,
      query: view.target.query,
    });
  }

  for (const view of mergedViews.added) {
    steps.push({
      kind: 'add_view',
      view: view.item.name,
      schema: view.item.schema,
      query: view.item.query,
    });
  }

  for (const rule of mergedRules.added) {
    steps.push({ kind: 'add_rule', rule: rule.item, ruleId: rule.key });
  }

  for (const rule of mergedRules.removed) {
    steps.push({ kind: 'drop_rule', ruleId: rule.key });
  }

  return steps.map((step) => {
    if (step.kind === 'drop_rule' || step.kind === 'add_rule') {
      return step;
    }
    if (step.schema === undefined || step.schema === null) {
      delete step.schema;
    }
    return step;
  });
}
