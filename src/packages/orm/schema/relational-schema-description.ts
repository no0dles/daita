import { SchemaMapper } from './description/schema-mapper';
import {
  addExistingSeed,
  addIndexToTable,
  addRuleToSchema,
  addSeed,
  addTableField,
  addTableReference,
  addTableToSchema,
  addViewToSchema,
  dropRuleFromSchema,
  dropTableField,
  dropTableFromSchema,
  dropTableIndex,
  dropTableReference,
  dropViewFromSchema,
  getTableFromSchema,
  getViewFromSchema,
  removeSeed,
  SchemaDescription,
  setTablePrimaryKey,
  updateSeed,
} from './description/relational-schema-description';
import { failNever } from '../../common/utils/fail-never';
import { MigrationDescription } from '../migration/migration-description';
import { table } from '../../relational/sql/keyword/table/table';

export function getSchemaDescription(
  name: string,
  schemaMapper: SchemaMapper,
  paths: MigrationDescription[],
): SchemaDescription {
  const schema: SchemaDescription = { views: {}, tables: {}, rules: {}, name };

  for (const path of paths) {
    for (const step of path.steps) {
      if (step.kind === 'add_table') {
        addTableToSchema(schema, {
          schema: step.schema,
          table: step.table,
        });
      } else if (step.kind === 'add_table_field') {
        const result = getTableFromSchema(schema, table(step.table, step.schema));
        addTableField(result.table, {
          key: step.fieldName,
          required: step.required,
          defaultValue: step.defaultValue,
          size: step.size,
          type: step.type,
        });
      } else if (step.kind === 'add_table_primary_key') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        setTablePrimaryKey(table, step.fieldNames);
      } else if (step.kind === 'drop_table_primary_key') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        setTablePrimaryKey(table, []);
      } else if (step.kind === 'add_table_foreign_key') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        const foreignTable = getTableFromSchema(schema, { schema: step.foreignTableSchema, table: step.foreignTable });
        addTableReference(table, {
          name: step.name,
          required: step.required,
          referenceTable: foreignTable.table,
          referenceTableKey: foreignTable.key,
        });
      } else if (step.kind === 'drop_table_field') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        dropTableField(table, step.fieldName);
      } else if (step.kind === 'drop_table') {
        dropTableFromSchema(schema, table(step.table, step.schema));
      } else if (step.kind === 'create_index') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        addIndexToTable(table, {
          key: step.name,
          fields: step.fields,
          unique: step.unique ?? false,
        });
      } else if (step.kind === 'drop_index') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        dropTableIndex(table, step.name);
      } else if (step.kind === 'drop_table_foreign_key') {
        const { table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        dropTableReference(table, step.name);
      } else if (step.kind === 'add_rule') {
        addRuleToSchema(schema, step.ruleId, step.rule);
      } else if (step.kind === 'drop_rule') {
        dropRuleFromSchema(schema, step.ruleId);
      } else if (step.kind === 'add_view') {
        addViewToSchema(schema, {
          query: step.query,
          schema: step.schema,
          name: step.view,
        });
      } else if (step.kind === 'drop_view') {
        dropViewFromSchema(schema, table(step.view, step.schema));
      } else if (step.kind === 'alter_view') {
        const view = getViewFromSchema(schema, { schema: step.schema, table: step.view });
        view.query = step.query;
      } else if (step.kind === 'insert_seed') {
        const { key, table } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        addExistingSeed(key, table, step.seed, step.keys);
      } else if (step.kind === 'update_seed') {
        const { table, key } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        updateSeed(key, table, { keys: step.keys, seed: step.seed });
      } else if (step.kind === 'delete_seed') {
        const { table, key } = getTableFromSchema(schema, { schema: step.schema, table: step.table });
        removeSeed(key, table, step.keys);
      } else {
        failNever(step, 'unknown migration step');
      }
    }
  }

  return schema;
}
