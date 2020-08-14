import { merge } from '@daita/common';
import { RelationalSchemaDescription } from '../../schema/description/relational-schema-description';
import { MigrationStep } from '../migration-step';
import { generateRelationalTableMigrationSteps } from './generate-relational-table-migration-steps';

export function generateRelationalMigrationSteps(
  currentSchema: RelationalSchemaDescription,
  newSchema: RelationalSchemaDescription,
) {
  const steps: MigrationStep[] = [];

  const mergedTables = merge(currentSchema.tables, newSchema.tables, (first, second) => first.key === second.key);
  const mergedViews = merge(currentSchema.views, newSchema.views, (first, second) => first.key === second.key);

  for (const table of mergedTables.added) {
    steps.push({ kind: 'add_table', table: table.name });
    for (const field of table.fields) {
      steps.push({
        kind: 'add_table_field',
        table: table.name,
        schema: table.schema,
        fieldName: field.name,
        type: field.type,
        required: field.required,
        defaultValue: field.defaultValue,
      });
    }

    steps.push(
      { kind: 'add_table_primary_key', table: table.name, fieldNames: table.primaryKeys.map(k => k.name) },
    );

    for (const index of table.indices) {
      steps.push({
        kind: 'create_index',
        table: table.name,
        schema: table.schema,
        unique: index.unique,
        name: index.name,
        fields: index.fields.map(f => f.name),
      });
    }
  }

  for (const merge of mergedTables.merge) {
    steps.push(...generateRelationalTableMigrationSteps(merge.current, merge.target));
  }

  for (const view of mergedViews.removed) {
    steps.push({ kind: 'drop_view', schema: view.schema, view: view.name });
  }

  for (const table of mergedTables.removed) {
    for (const reference of table.references) {
      steps.push({ kind: 'drop_table_foreign_key', table: table.name, schema: table.schema, name: reference.name });
    }
  }

  for (const table of mergedTables.removed) {
    steps.push({ kind: 'drop_table', table: table.name });
  }

  for (const table of mergedTables.added) {
    for (const foreignKey of table.references) {
      steps.push({
        kind: 'add_table_foreign_key',
        table: table.name,
        schema: table.schema,
        name: foreignKey.name,
        fieldNames: foreignKey.keys.map(key => key.field.name),
        foreignFieldNames: foreignKey.keys.map(key => key.foreignField.name),
        foreignTable: foreignKey.table.name,
        required: foreignKey.required,
      });
    }
  }

  for (const view of mergedViews.merge) {
    steps.push({ kind: 'alter_view', view: view.current.name, schema: view.current.schema, query: view.target.query });
  }

  for (const view of mergedViews.added) {
    steps.push({ kind: 'drop_view', view: view.name, schema: view.schema });
  }

  return steps.map(step => {
    if (step.kind === 'drop_rule' || step.kind === 'add_rule') {
      return step;
    }
    if (step.schema === undefined || step.schema === null) {
      delete step.schema;
    }
    return step;
  });
}
