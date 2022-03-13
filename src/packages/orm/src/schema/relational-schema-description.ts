import { SchemaMapper } from './description/schema-mapper';
import {
  addExistingSeed,
  addIndexToTable,
  addRuleToSchema,
  addTableField,
  addTableReference,
  addTableToSchema,
  addViewToSchema,
  dropRuleFromSchema,
  doDropTableField,
  dropTableFromSchema,
  dropTableIndex,
  dropTableReference,
  dropViewFromSchema,
  removeSeed,
  SchemaDescription,
  setTablePrimaryKey,
  updateSeed,
  alterViewFromSchema,
} from './description/relational-schema-description';
import { failNever } from '@daita/common';
import { MigrationDescription } from '../migration/migration-description';
import { table } from '@daita/relational';
import { MigrationPlanStep } from '../context';
import { MigrationStep } from '../migration';

function getMigrationPlanStep(step: MigrationStep, schema: SchemaDescription): SchemaDescription {
  if (step.kind === 'add_table') {
    return addTableToSchema(schema, {
      schema: step.schema,
      table: step.table,
    });
  } else if (step.kind === 'add_table_field') {
    return addTableField(
      schema,
      { schema: step.schema, table: step.table },
      {
        key: step.fieldName,
        required: step.required,
        defaultValue: step.defaultValue,
        size: step.size,
        type: step.type,
      },
    );
  } else if (step.kind === 'add_table_primary_key') {
    return setTablePrimaryKey(schema, { schema: step.schema, table: step.table }, step.fieldNames);
  } else if (step.kind === 'drop_table_primary_key') {
    return setTablePrimaryKey(schema, { schema: step.schema, table: step.table }, []);
  } else if (step.kind === 'add_table_foreign_key') {
    return addTableReference(
      schema,
      { schema: step.schema, table: step.table },
      { schema: step.foreignTableSchema, table: step.foreignTable },
      {
        name: step.name,
        required: step.required,
        onDelete: step.onDelete ?? null,
        onUpdate: step.onUpdate ?? null,
      },
    );
  } else if (step.kind === 'drop_table_field') {
    return doDropTableField(schema, { schema: step.schema, table: step.table }, step.fieldName);
  } else if (step.kind === 'drop_table') {
    return dropTableFromSchema(schema, table(step.table, step.schema));
  } else if (step.kind === 'create_index') {
    return addIndexToTable(
      schema,
      { schema: step.schema, table: step.table },
      {
        key: step.name,
        fields: step.fields,
        unique: step.unique ?? false,
      },
    );
  } else if (step.kind === 'drop_index') {
    return dropTableIndex(schema, { schema: step.schema, table: step.table }, step.name);
  } else if (step.kind === 'drop_table_foreign_key') {
    return dropTableReference(schema, { schema: step.schema, table: step.table }, step.name);
  } else if (step.kind === 'add_rule') {
    return addRuleToSchema(schema, step.ruleId, step.rule);
  } else if (step.kind === 'drop_rule') {
    return dropRuleFromSchema(schema, step.ruleId);
  } else if (step.kind === 'add_view') {
    return addViewToSchema(schema, {
      query: step.query,
      schema: step.schema,
      name: step.view,
    });
  } else if (step.kind === 'drop_view') {
    return dropViewFromSchema(schema, table(step.view, step.schema));
  } else if (step.kind === 'alter_view') {
    return alterViewFromSchema(schema, { schema: step.schema, table: step.view }, step.query);
  } else if (step.kind === 'insert_seed') {
    return addExistingSeed(schema, { schema: step.schema, table: step.table }, step.seed, step.keys);
  } else if (step.kind === 'update_seed') {
    return updateSeed(schema, { schema: step.schema, table: step.table }, { keys: step.keys, seed: step.seed });
  } else if (step.kind === 'delete_seed') {
    return removeSeed(schema, { schema: step.schema, table: step.table }, step.keys);
  } else {
    failNever(step, 'unknown migration step');
  }
}

export function emptySchema(name: string): SchemaDescription {
  return { views: {}, tables: {}, rules: {}, name };
}

export function getSchemaDescription(
  schema: SchemaDescription,
  schemaMapper: SchemaMapper,
  paths: MigrationDescription[],
): { schema: SchemaDescription; steps: MigrationPlanStep[] } {
  const steps: MigrationPlanStep[] = [];

  for (const path of paths) {
    for (const step of path.steps) {
      const newSchema = getMigrationPlanStep(step, schema);
      steps.push({
        schema: newSchema,
        migrationStep: step,
      });
      schema = newSchema;
    }
  }

  return { schema, steps };
}
